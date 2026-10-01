import img1  from "../assets/brow.webp";
import img2  from "../assets/nut.webp";
import img3  from "../assets/tri.webp";
import img4  from "../assets/vanilla.webp";
import img5  from "../assets/rasamalai.avif";
import img6  from "../assets/chocolate.jpeg";
import img7  from "../assets/red velvet.avif";
import img8  from "../assets/tender coconut.webp";
import img9  from "../assets/black.webp";
import img10 from "../assets/white.webp";
import img11 from "../assets/choco truffle.avif";
import img12 from "../assets/honey.webp";
import img13 from "../assets/Butterscotch.jpeg";
import img14 from "../assets/rose.jpg";
import img15 from "../assets/Blueberry.webp";

export const IMAGE_MAP = {
  "vanilla cake": img4,
  "rasamalai cake": img5,
  "chocolate cake": img6,
  "chocolate fudge cake": img6,
  "red velvet cake": img7,
  "tender coconut cake": img8,
  "black forest cake": img9,
  "white forest cake": img10,
  "choco truffle cake": img11,
  "honey cake": img12,
  "butterscotch cake": img13,
  "rosemilk cake": img14,
  "rose milk cake": img14,
  "blueberry cake": img15,
  "fudge brownie": img1,
  "brownie": img1,
  "fudge walnut brownie": img1,
  "nuts brownie": img2,
  "nutella loaded brownie": img2,
  "triple chocolate brownie": img3,
  "triple choco brownie": img3,
};

export const getProductImage = (product) => {
  if (!product) return img4;
  
  // If product already has an imported image object/variable
  if (product.image && typeof product.image !== "string") return product.image;
  
  // Check mapped name
  const nameKey = (product.name || "").toLowerCase().trim();
  if (IMAGE_MAP[nameKey]) {
    return IMAGE_MAP[nameKey];
  }
  
  // Partial keyword matching
  if (nameKey.includes("rasamalai")) return img5;
  if (nameKey.includes("red velvet")) return img7;
  if (nameKey.includes("tender coconut")) return img8;
  if (nameKey.includes("black forest")) return img9;
  if (nameKey.includes("white forest")) return img10;
  if (nameKey.includes("choco truffle") || nameKey.includes("truffle")) return img11;
  if (nameKey.includes("honey")) return img12;
  if (nameKey.includes("butterscotch")) return img13;
  if (nameKey.includes("rose")) return img14;
  if (nameKey.includes("blueberry")) return img15;
  if (nameKey.includes("chocolate") || nameKey.includes("choco")) return img6;
  if (nameKey.includes("vanilla")) return img4;
  if (nameKey.includes("nut")) return img2;
  if (nameKey.includes("brownie")) return img1;

  // If valid HTTP image URL exists
  if (product.imageUrl && product.imageUrl.startsWith("http") && !product.imageUrl.includes("unsplash")) {
    return product.imageUrl;
  }

  // Default fallback
  return img4;
};
