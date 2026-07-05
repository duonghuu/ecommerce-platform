import { Metadata } from "next";
import { CategoryContainer } from "./CategoryContainer";

import fs from "fs";
import path from "path";
import { Category } from "./types";

export const metadata: Metadata = {
  title: "Categories | DashStack Admin",
  description: "Manage product categories",
};

const CategoriesPage = () => {
  const filePath = path.join(process.cwd(), "../../.docs/mock-data/categories.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  const mockCategories = JSON.parse(fileContents) as Category[];

  return <CategoryContainer initialCategories={mockCategories} />;
};

export default CategoriesPage;
