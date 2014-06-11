# modified from https://gist.githubusercontent.com/fastdivision/5890772/raw/filter_posts_and_categories.rb
module Jekyll
  module UncategorizedFilter
    # Returns back all categories related to a primary category
    # e.g. "blog" or "questions"
    def filter_categorized_posts(posts)
      filtered = []
      for post in posts
        if post.categories == []
          filtered.push(post)
        end
      end
      return filtered
    end
  end
end

Liquid::Template.register_filter(Jekyll::UncategorizedFilter)
