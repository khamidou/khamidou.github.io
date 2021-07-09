// Ok, so for the past month or so I've been fascinated by this
// [donut.c file](https://www.a1k0n.net/2011/07/20/donut-math.html) that draws
// an animated donut in the terminal.
//
// To understand it, I rebuilt it in Javascript in the browser, with built-in texturing. Here's what it looks like:
//
// <iframe src="donuts.html" width="100%" height="100%" ></iframe>
//
// (I know, I know, very anticlimatic).
//
// Why do this?
// 1. I've always thought graphics programming was very mysterious with a lot of heavy math. Donut.c and the blog post that goes with it really broke it down to an understandable level!
// 2. I love donuts.
//
// This post will break down the source of my port somewhat line-by-line.
//
// However, please keep in mind I have very little idea about the right way to do graphics programmings. I've mostly pieced the code together from various sources and sticked to what worked.

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

function drawDonut() {
  let circle_radius = 50;
  let torus_radius = 200;

  // ## The Canvas API
  //
  // I decided to go with the Canvas API because it seems like the fastest way
  // to draw pixels in a browser window. It's a bit of a strange API because
  // it's very high-level and kind of a black box.
  //
  // For example, I couldn't find how to paint a single pixel – you have to
  // either draw a rectangle or a line. When trying to optimize the rendering,
  // I had to try a bunch of techniques to see what would work.
  //
  // Another issue is that we have to do these intricate scaling hacks because the canvas API
  // doesn't know about hidpi displays:
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
  var canvas = document.getElementById("donutCanvas");

  canvas.style.width = windowWidth + "px";
  canvas.style.height = windowHeight + "px";

  var windowScale = window.devicePixelRatio;
  canvas.width = Math.floor(windowWidth * windowScale);
  canvas.height = Math.floor(windowHeight * windowScale);

  // A small optimization – instead of rendering directly to the screen, we
  // render to a buffer that then gets rendered to the screen. This is called
  // [double buffering](https://en.wikipedia.org/wiki/Multiple_buffering#Double_buffering_in_computer_graphics).
  var offscreenCanvas = new OffscreenCanvas(2.5 * torus_radius, 2.5 * torus_radius);

  // Another small optimization – our offscreen canvas is actually smaller
  // than the whole screen – this means that we only have to repaint part of the
  // screen at every render.
  offscreenCanvas.width = 3 * torus_radius;
  offscreenCanvas.height = canvas.height;

  let donutTexture = new Image();

  var ctx = canvas.getContext("2d", { alpha: false });
  var offscreenCtx = offscreenCanvas.getContext("2d", { alpha: false });

  // A handful of constants and variables which are explained in more details
  // in donut.c. A and B are our rotation angles around the Y and Z axes, while
  // K1 and K2 have to do with the projection of the picture to a 2D space.
  let A = 0;
  let B = 0;
  const K1 = 200;
  const K2 = 600;

  let startTimestamp = null;

  function doDrawTorus() {
    // ## Drawing Toruses

    // First, let's slightly increment the current rotation angles.
    A += 0.01;
    B += 0.02;

    let start_x = offscreenCanvas.width / 2;
    let start_y = offscreenCanvas.height / 2;

    // We use a [Z-buffer](https://en.wikipedia.org/wiki/Z-buffering) to keep
    // track of the pixels we need to paint. This solves the problem of having
    // one pixel that is not visible because it's covered by another one.
    var zbuffer = new Array();

    offscreenCtx.fillStyle = 'black';
    offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    offscreenCtx.fillStyle = 'salmon';

    // Next, we have several complicated math functions that are explained in a bit more details in [donut.c](https://www.a1k0n.net/2011/07/20/donut-math.html)
    // Basically, we have to do two things:
    // 1. Draw a static torus.
    // 2. Rotate that torus along Y and Z with an angle of A and B respectively.
    //
    // This all leads to very complicated math. Luckily, nowadays Wolfram Alpha
    // makes matrix multiplication a breeze.
    function compute_next_x(A, B, torus_radius, circle_radius, theta, phi, canvas) {
        return (torus_radius + circle_radius * Math.cos(theta)) *
               (Math.cos(B) *  Math.cos(phi) + Math.sin(A) * Math.sin(B) * Math.sin(phi)) -
               circle_radius * Math.cos(A) * Math.sin(B) * Math.sin(theta) + offscreenCanvas.width / 2;
    }

    function compute_next_y(A, B, torus_radius, circle_radius, theta, phi, canvas) {
        return (torus_radius + circle_radius * Math.cos(theta)) *
               (Math.cos(phi) * Math.sin(B) - Math.cos(B) * Math.sin(A) * Math.sin(phi)) +
               (circle_radius * Math.cos(A) * Math.cos(B) * Math.sin(theta)) + offscreenCanvas.height / 2;
    }

    function compute_next_z(A, torus_radius, circle_radius, theta, phi) {
      return Math.cos(A) * (torus_radius + circle_radius * Math.cos(theta)) * Math.sin(phi) +
                            circle_radius * Math.sin(A) * Math.sin(theta);
    }

    // ### Texture mapping
    //
    // We also need to do texture mapping, which means figuring out which pixels
    // from our texture image go where. Typically 3D engines do this in a complicated way – you can find more details [here](https://gabrielgambetta.com/computer-graphics-from-scratch/14-textures.html).
    // However, we can also do the simple thing here and just fetch the values of each pixel directly.
    //
    // This is of course pretty computationally expensive, but like we say in France, if you don't have a brain at least you have legs.
    //
    function compute_map_texture_x(torus_radius, circle_radius, theta, phi) {
      return Math.abs(((torus_radius + circle_radius * Math.cos(theta)) * Math.cos(phi) +
               0 * Math.sin(phi)));
    }

    function compute_map_texture_y(torus_radius, circle_radius, theta, phi) {
      // turns out it's the identity function:
      return Math.abs(circle_radius * Math.sin(theta));
    }

    function compute_luminance(A, B, theta, phi) {
      return (Math.cos(phi) * Math.cos(theta) * Math.sin(B) - Math.cos(A) * Math.cos(theta) * Math.sin(phi) -
              Math.sin(A) * Math.sin(theta) + Math.cos(B) * (Math.cos(A) * Math.sin(theta) - Math.cos(theta) * Math.sin(A) * Math.sin(phi)));
    }

    // Finally, we construct the Taurus by iterating twice, first by drawing a
    // circle then rotating around A and B.
    for (let phi = 0; phi < 2 * Math.PI; phi += (2 * Math.PI) / 360) {
      for (let theta = 0; theta < 2 * Math.PI; theta += (2 * Math.PI) / 20) {

        let next_x = compute_next_x(A, B, torus_radius, circle_radius, theta, phi, canvas);
        let next_y = compute_next_y(A, B, torus_radius, circle_radius, theta, phi, canvas);
        let next_z = compute_next_z(A, torus_radius, circle_radius, theta, phi);
        let texture_mapping_x = compute_map_texture_x(torus_radius, circle_radius, theta, phi);
        let texture_mapping_y = compute_map_texture_y(torus_radius, circle_radius, theta, phi);
        let luminance_value = compute_luminance(A, B, theta, phi);

        if (typeof zbuffer[next_x] == "undefined") {
          zbuffer[next_x] = Array();
        }

        if (typeof zbuffer[next_x][next_y] == "undefined") {
            zbuffer[next_x][next_y] = [next_z, next_x, next_y,
                                       texture_mapping_x, texture_mapping_y, luminance_value];
            continue;
        }

        if (zbuffer[next_x][next_y][0] < next_z) {
          continue;
        }
      }
    }

    // Now that we've computed everything, we can just iterate through the
    // Z-buffer and use it to draw on our offscreen canvas.
    for(let i in zbuffer) {
        for (let j in zbuffer[i]) {
          dest_x = Math.floor(zbuffer[i][j][1]);
          dest_y = Math.floor(zbuffer[i][j][2]);
          texture_map_x = Math.floor(zbuffer[i][j][3]);
          texture_map_y = Math.floor(zbuffer[i][j][4]);
          luminance_value = zbuffer[i][j][5];

          offscreenCtx.drawImage(donutTexture, texture_map_x, texture_map_y, 30, 30, dest_x, dest_y, 30, 30);
        }
    }

    // Finally replace the contents of the screen with the ones from the
    // offscreen canvas.
    ctx.drawImage(offscreenCanvas, (canvas.width  - offscreenCanvas.width) / 2, 0);
  }

  function draw(timestamp) {
    if (startTimestamp === undefined) {
      startTimestamp = timestamp;
    }

    const elapsed = timestamp - startTimestamp;
    doDrawTorus();

    window.requestAnimationFrame(draw);
  }

  donutTexture.addEventListener('load', function() {
    window.requestAnimationFrame(draw);
  });

  donutTexture.src = 'donut.jpeg';
}

document.addEventListener("DOMContentLoaded", drawDonut)

// If you've read this far, congratulations! I'm not sure if all of this made
// sense but let me reassure you – basic 3D is actually not that hard and pretty gratifying!
//
// Best,
// Karim
