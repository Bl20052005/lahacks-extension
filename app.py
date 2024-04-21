from flask import Flask, request, jsonify
from langchain_community.document_loaders import WebBaseLoader
from urllib.parse import urlparse
import google.generativeai as genai
from dotenv import load_dotenv
import json
import requests
import os
from flask_cors import CORS

load_dotenv()

genai.configure(api_key=os.getenv("gemini_key"))

app = Flask(__name__)
CORS(app)


@app.route("/scrape", methods=["POST"])
def scrape_call():
    # Get the web_url from the request body
    data = request.get_json()
    web_url = data.get("web_url")

    print(web_url)

    # Given a URL, this function scrapes all the data in the url and returns
    loader = WebBaseLoader(web_url)
    data = loader.load()[0].metadata
    search_type = data["source"]

    # Checking to see if the url is of an amazon product
    url = urlparse(search_type)
    try:
        if "amazon." in url.netloc:
            if "dp" in url.path.split("/"):
                return jsonify(
                    {"title": data["title"], "description": data["description"]}
                )
            return jsonify({"title": "None", "description": "None"})
        return jsonify({"title": "None", "description": "None"})
    except ValueError:
        return jsonify({"title": "None", "description": "None"})


@app.route("/gemini", methods=["POST"])
def gemini_call():
    # loading information sent by front end after confirming that user is on a product
    data = request.get_json()
    product_title = data.get("title")
    product_description = request.form.get("description")

    print("product ttle and description", product_description, product_title)

    # configuration of Gemini
    generation_config = {
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 0,
        "max_output_tokens": 8192,
    }

    # Safety Settings for Gemini
    safety_settings = [
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE",
        },
    ]

    model = genai.GenerativeModel(
        model_name="gemini-1.0-pro-001",
        generation_config=generation_config,
        safety_settings=safety_settings,
    )

    prompt_parts = [
        "A consumer wants to check if a product and the company selling it is sustainable and has sustainable practices. Given the product name and product description, find the following:\n1. Product description which specifies the materials it is made out of and if these materials are sustainable or not. If there is no information about the sustainability of that specific product, talk about the sustainability of the product in general (in less than 50 words)\n2. Company description with regard to its sustainable practices (in less than 50 words)\n3. An overall sustainability rating of the product only (not the company) where the answer is only in yes(1)/no(-1)/maybe(0). If the object is not sustainable but the company has sustainable, consider the overall sustainability as no(-1).\n4. Product type",
        "Product: Amazon.com: Nike mens Blazer Mid 77 Vintage : Clothing, Shoes & Jewelry",
        "Description Buy Nike mens Blazer Mid 77 Vintage: Shop top fashion brands Fashion Sneakers at Amazon.com ✓ FREE DELIVERY and Returns possible on eligible purchases",
        "product_description The Nike Blazer Mid '77 Vintage is a timeless design with a crisp leather upper and soft suede accents. However, there’s no specific information about the product’s sustainability or use of recycled materials.",
        "company_description Nike has a sustainability program called “Move to Zero” which focuses on zero carbon and zero waste, aiming to hit targets by 2025. They aim to reduce their carbon footprint by 63% by 2030 and reach net zero by 2050.",
        "overall_sustainability 0",
        "product_type Shoe",
        "Product: Amazon.com : Sustainably Yours Cat Litter, Mixed-Grain Formula 10 lbs : Pet Supplies",
        "Description Amazon.com : Sustainably Yours Cat Litter, Mixed-Grain Formula 10 lbs : Pet Supplies",
        "product_description Sustainably Yours Cat Litter is made from corn and cassava, which are renewable crops and biodegradable. It offers long-lasting odor control without using chemicals or fragrances.",
        "company_description Sustainably Yours emphasizes the sustainability of its materials and is committed to being environmentally friendly.",
        "overall_sustainability 1",
        "product_type Cat Litter",
        "Product: Amazon.com | GUBARUN Men's Oxfords Mesh Dress Sneakers Lightweight Lace Up Casual Business Walking Shoes Navy, 7 US Men | Oxfords",
        "Description Buy GUBARUN Men's Oxfords Mesh Dress Sneakers Lightweight Lace Up Casual Business Walking Shoes Navy, 7 US Men and other Oxfords at Amazon.com. Our wide selection is eligible for free shipping and free returns.",
        "product_description GUBARUN Men's Oxfords Mesh Dress Sneakers are lightweight and designed for breathability and comfort. However, there's no specific information available regarding the materials or sustainability practices involved in their production.",
        "company_description There is no readily available information about GUBARUN's commitment to sustainability or any specific practices they may have in place.",
        "overall_sustainability 0",
        "product_type Shoe",
        "Product: Amazon.com: Valve Steam Deck,HDMI, 64 GB, Black : Video Games",
        "Description Amazon.com: Valve Steam Deck,HDMI, 64 GB, Black : Video Games",
        "product_description The Valve Steam Deck is a portable gaming device. While there’s no specific information about the product’s sustainability, it does come with a carrying case to protect it from damage, potentially extending its lifespan.",
        "company_description Valve, the company behind the Steam Deck, has been known to implement efficient valve technologies as part of their sustainability goals. However, there’s no specific information about their sustainability practices related to the Steam Deck.",
        "overall_sustainability 0",
        "product_type Hand Held Video Game Console",
        "Product: Amazon.com : Orgain Organic Vegan Protein Powder, Vanilla Bean - 21g Plant Based Protein, Gluten Free, Dairy Free, Lactose Free, Soy Free, No Sugar Added, Kosher, For Smoothies & Shakes - 2.03lb : Health & Household",
        "Description Amazon.com : Orgain Organic Vegan Protein Powder, Vanilla Bean - 21g Plant Based Protein, Gluten Free, Dairy Free, Lactose Free, Soy Free, No Sugar Added, Kosher, For Smoothies & Shakes - 2.03lb : Health & Household",
        "product_description The Orgain Organic Vegan Protein Powder is a USDA certified Organic product, meaning it supports sustainable agriculture with less pesticides, healthier soils, and higher nutrient value of what is grown.",
        "company_description Orgain has launched a Green Initiative that reduced plastic used in containers by 40%, saving 30,000 pounds of plastic annually2. They use bio-based caps made from sugarcane, a renewable source2.",
        "overall_sustainability 1",
        "product_type Protein Powder",
        "Product: Amazon.com: VIZIO 40-inch D-Series Full HD 1080p Smart TV with AMD FreeSync, Apple AirPlay and Chromecast Built-in, Alexa Compatibility, D40f-J09, 2022 Model : Electronics",
        "Description Buy VIZIO 40-inch D-Series Full HD 1080p Smart TV with AMD FreeSync, Apple AirPlay and Chromecast Built-in, Alexa Compatibility, D40f-J09, 2022 Model: LED & LCD TVs - Amazon.com ✓ FREE DELIVERY possible on eligible purchases",
        "product_description The VIZIO 40-inch D-Series Full HD 1080p Smart TV is a SmartCast device, which provides access to a wide range of streaming services1. However, there’s no specific information about the product’s sustainability.",
        "company_description VIZIO is committed to sustainability and protecting the environment. They have an award-winning electronic waste recycling program and have helped divert more than 305 million pounds of e-waste from landfills in the United States",
        "overall_sustainability 0",
        "product_type Television",
        "Product: Amazon.com: Beeleeve [500-Box Disposable Plastic Poly Gloves - One Size Fits Most - Color Variants - Single-Use Hand Covers for Food Safe Handling, Preparation, Kitchen, Cooking, Waterproof, Bulk (a - Clear) : Health & Household",
        "Description Buy Beeleeve [500-Box Disposable Plastic Poly Gloves - One Size Fits Most - Color Variants - Single-Use Hand Covers for Food Safe Handling, Preparation, Kitchen, Cooking, Waterproof, Bulk (a - Clear) on Amazon.com ✓ FREE SHIPPING on qualified orders",
        "product_description The Beeleeve Disposable Plastic Poly Gloves are single-use, which may not be ideal from a sustainability perspective as they contribute to plastic waste.",
        "company_description There’s no specific information available about Beeleeve’s sustainability practices.",
        "overall_sustainability -1",
        "product_type Disposable Glove",
        "Product: Amazon.com : Dove Beauty Bar More Moisturizing Than Bar Soap for Softer Skin, Fragrance Free, Hypoallergenic Sensitive Skin With Gentle Cleanser, 3.75 Ounce (Pack of 8) : Bath Soaps : Beauty & Personal Care",
        "Description Amazon.com : Dove Beauty Bar More Moisturizing Than Bar Soap for Softer Skin, Fragrance Free, Hypoallergenic Sensitive Skin With Gentle Cleanser, 3.75 Ounce (Pack of 8) : Bath Soaps : Beauty & Personal Care",
        "product_description Dove Beauty Bar is a hypoallergenic bar soap that is fragrance-free and gentle on sensitive skin. It is made with ¼ moisturizing cream for softer skin. However, there is no specific information regarding the sustainability of the product or its packaging.",
        "company_description Dove, as part of Unilever, has committed to making their plastic packaging reusable, recyclable, or compostable by 2025. They are also working to reduce their greenhouse gas emissions and water usage.",
        "overall_sustainability 0",
        "product_type Bar Soap",
        "Product: Amazon.com: Qinline Reusable Food Storage Bags - 24 Pack Dishwasher Safe Freezer Bags, BPA Free Reusable Bags Silicone, Leakproof Reusable Lunch Bag for Salad Fruit Travel - 8 Gallon 8 Sandwich 8 Snack Bags: Home & Kitchen",
        "Description Shop Qinline at the Amazon Storage & Organization store. Free Shipping on eligible items. Everyday low prices, save up to 50%.",
        "product_description The Qinline Reusable Food Storage Bags are made of food-grade PEVA material, which is non-toxic. They are reusable, leak-proof, and waterproof, making them an eco-friendly alternative to single-use plastic bags.",
        "company_description Qinline focuses on providing reusable alternatives to single-use plastics, promoting sustainability and waste reduction.",
        "overall_sustainability 1",
        "product_type Reusable Food Storage Bags",
        "Product: Amazon.com: Amazon Essentials Women's Classic-Fit Short-Sleeve Crewneck T-Shirt, Multipacks : Clothing, Shoes & Jewelry",
        "Description Amazon.com: Amazon Essentials Women's Classic-Fit Short-Sleeve Crewneck T-Shirt, Multipacks : Clothing, Shoes & Jewelry",
        "product_description Amazon Essentials Women's Classic-Fit Short-Sleeve Crewneck T-Shirt is made of 100% cotton, a natural and biodegradable material.",
        "company_description Amazon has a Climate Pledge Friendly program that highlights products that meet sustainability standards. They also have sustainability initiatives in packaging and renewable energy.",
        "overall_sustainability 1",
        "product_type Clothing",
        "Product: Amazon.com: AIDEA Acacia Wooden Serving Bowls, 7 Inch Set of 4 for Salad, Soup, Noodle and More : Home & Kitchen",
        "Description Amazon.com: AIDEA Acacia Wooden Serving Bowls, 7 Inch Set of 4 for Salad, Soup, Noodle and More : Home & Kitchen",
        "product_description The AIDEA Acacia Wooden Serving Bowls are made of natural acacia wood, which is a sustainable material. They are handcrafted, adding to their eco-friendly nature.",
        "company_description AIDEA is committed to sustainable design. They leverage cutting-edge technology to provide innovative and sustainable solutions.",
        "overall_sustainability 1",
        "product_type Serving Bowls",
        "Product: Amazon.com: Dunkin' Original Blend Medium Roast Coffee, 60 Keurig K-Cup Pods : Grocery & Gourmet Food",
        "Description Amazon.com: Dunkin' Original Blend Medium Roast Coffee, 60 Keurig K-Cup Pods : Grocery & Gourmet Food",
        "product_description The Dunkin’ Original Blend Medium Roast Coffee is made of 100% Arabica beans and comes in Keurig K-Cup Pods. While the product itself does not mention sustainability, K-Cup Pods in general have been criticized for their environmental impact.",
        "company_description Dunkin’ is committed to 100% responsibly sourced coffee by 2025. They are working on sustainable packaging, energy efficiency, and supporting sustainable growing practices among farmers.",
        "overall_sustainability -1",
        "product_type Coffee Pods",
        "Product: Amazon.com: Tide PODS Laundry Detergent Soap Pods, Spring Meadow Scent, 112 count : Health & Household",
        "Description Amazon.com: Tide PODS Laundry Detergent Soap Pods, Spring Meadow Scent, 112 count : Health & Household",
        "product_description The Tide PODS Laundry Detergent Soap Pods are made of concentrated detergents, powerful stain removers, and color protectors. While the product itself does not mention sustainability, laundry detergent pods in general have been criticized for their environmental impact.",
        "company_description Tide is committed to sustainable manufacturing and aims to use 100% renewable or recycled materials for all products and packaging. They are also working to decarbonize laundry at every step.",
        "overall_sustainability -1",
        "product_type Laundry Detergent Pods",
        "Product: Amazon.com: Glad Disposable Plastic Cutlery, Assorted Set | Clear Extra Heavy Duty forks, Knives, And Spoons | Disposable Party Utensils | 240 Piece Set of Durable and Sturdy Cutlery : Health & Household",
        "Description Amazon.com: Glad Disposable Plastic Cutlery, Assorted Set | Clear Extra Heavy Duty forks, Knives, And Spoons | Disposable Party Utensils | 240 Piece Set of Durable and Sturdy Cutlery : Health & Household",
        "product_description The Glad Disposable Plastic Cutlery is designed for single use, which is not considered sustainable due to its contribution to plastic waste.",
        "company_description Glad has initiatives to reduce its environmental impact, including using recycled materials in some products and partnering with recycling programs. However, there's no specific information about the sustainability of their disposable cutlery.",
        "overall_sustainability -1",
        "product_type Disposable Cutlery",
        "Product: Amazon.com: Lysol All-Purpose Cleaner, Sanitizing and Disinfecting Spray, To Clean and Deodorize, Mango & Hibiscus Scent, 32oz : Everything Else",
        "Description Buy Lysol All-Purpose Cleaner, Sanitizing and Disinfecting Spray, To Clean and Deodorize, Mango & Hibiscus Scent, 32oz on Amazon.com ✓ FREE SHIPPING on qualified orders",
        "product_description The Lysol All-Purpose Cleaner is a sanitizing and disinfecting spray that eliminates viruses and bacteria. While the product itself does not mention sustainability, disinfecting sprays in general have been criticized for their environmental impact.",
        "company_description Lysol’s maker, Reckitt Benckiser, is committed to sustainability, focusing on improving carbon, ingredients, packaging, and water to meet their target. They also aim to provide healthier lives and happier homes.",
        "overall_sustainability -1",
        "product_type Disinfecting Spray",
        "Product: Amazon.com : Nespresso Capsules VertuoLine, Melozio, Medium Roast Coffee, Coffee Pods, Brews 7.77 Fl Ounce (VERTUOLINE ONLY), 10 Count (Pack of 3) : Everything Else",
        "Description Amazon.com : Nespresso Capsules VertuoLine, Melozio, Medium Roast Coffee, Coffee Pods, Brews 7.77 Fl Ounce (VERTUOLINE ONLY), 10 Count (Pack of 3) : Everything Else",
        "product_description The Nespresso Capsules VertuoLine, Melozio, are single-use aluminum capsules. While aluminum is recyclable, the convenience of these pods often leads to them being discarded rather than recycled.",
        "company_description Nespresso has a recycling program for its aluminum capsules and aims to make its operations carbon neutral. They also work with coffee farmers on sustainability practices.",
        "overall_sustainability -1",
        "product_type Coffee Pods",
        f"Product: {product_title}",
        f"Description {product_description}",
        "Please only output the details for the last product in a JSON format ['product_description':'*information based on what is asked before', 'company_description': '*information based on what was asked before*', 'overall_sustainability':'*-1 or 0 or 1*', 'product_type':'*generalized product type*' ]",
        "only give me the JSON output absolutely no markdown, the response type should be JSON",
    ]

    response = model.generate_content(prompt_parts)
    json_output = json.loads(response.text)

    return json_output


@app.route("/products", methods=["POST"])
def product_suggestions():
    # recieve product type
    data = request.get_json()
    product_type = data.get("product_type")

    # set up the request parameters
    payload = {
        "source": "amazon_search",
        "query": f"sustainable + {product_type}",
        "parse": True,
        "domain": "com",
        "start_page": "1",
        "pages": "1",
    }
    response = requests.request(
        "POST",
        "https://realtime.oxylabs.io/v1/queries",
        auth=(os.getenv("username"), os.getenv("pw")),
        json=payload,
    )

    # make the http GET request to Rainforest API
    api_result = response.json()

    # print(api_result)

    results = api_result["results"][0]["content"]["results"]["organic"]

    product_1 = results[0]
    product_2 = results[1]
    product_3 = results[2]
    product_4 = results[3]

    return jsonify(
        {
            "P1": {
                "title": product_1.get("title"),
                "link": product_1.get("url"),
                "image_url": product_1.get("url_image"),
                "cost": product_1.get("price_upper"),
            },
            "P2": {
                "title": product_2.get("title"),
                "link": product_2.get("url"),
                "image_url": product_2.get("url_image"),
                "cost": product_2.get("price_upper"),
            },
            "P3": {
                "title": product_3.get("title"),
                "link": product_3.get("url"),
                "image_url": product_3.get("url_image"),
                "cost": product_3.get("price_upper"),
            },
            "P4": {
                "title": product_4.get("title"),
                "link": product_4.get("url"),
                "image_url": product_4.get("url_image"),
                "cost": product_4.get("price_upper"),
            },
        }
    )


if __name__ == "__main__":
    app.run(debug=False)
