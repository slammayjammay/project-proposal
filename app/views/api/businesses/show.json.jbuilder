json.extract! @business, :id, :name, :rating, :review_count, :location,
  :snippet_text

json.extract! @business, :categories if @business.respond_to? :categories

json.extract! @business, :image_url if @business.respond_to? :image_url

json.sample_images @images
