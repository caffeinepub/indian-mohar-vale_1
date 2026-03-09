import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import List "mo:core/List";

actor {
  type Product = {
    nameEnglish : Text;
    nameHindi : Text;
    descriptionEnglish : Text;
    descriptionHindi : Text;
    price : Nat;
    priceLabel : Text;
  };

  type ShopInfo = {
    shopName : Text;
    ownerName : Text;
    phoneNumber1 : Text;
    phoneNumber2 : Text;
    address : Text;
    gstinNumber : Text;
  };

  let products = Map.empty<Text, Product>();

  public shared ({ caller }) func addProduct(id : Text, nameEnglish : Text, nameHindi : Text, descriptionEnglish : Text, descriptionHindi : Text, price : Nat, priceLabel : Text) : async () {
    let product : Product = {
      nameEnglish;
      nameHindi;
      descriptionEnglish;
      descriptionHindi;
      price;
      priceLabel;
    };
    products.add(id, product);
  };

  public query ({ caller }) func getProduct(id : Text) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func getShopInfo() : async ShopInfo {
    {
      shopName = "Indian Mohar Vale";
      ownerName = "Ashok Kumar Agrawal";
      phoneNumber1 = "6201721786";
      phoneNumber2 = "9415961119";
      address = "Shop 2, First Floor, Bhaghambari Press";
      gstinNumber = "09AHFPA6617Q1ZA";
    };
  };
};
