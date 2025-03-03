import { Options } from "../components/ExplorerNode"
import { EXCLUDE_SLUGS } from "./constants"
export const mapFn: Options["mapFn"] = (node) => {
  return node
}
export const filterFn: Options["filterFn"] = (node) => {
  // Extract the base name without extension and path
  const baseName = node.name.split("/").pop()?.split(".")[0]
  console.log(baseName)
  // Only show files that are in the allowedFiles list
  return baseName ? EXCLUDE_SLUGS.includes(node.name) : false
}
export const sortFn: Options["sortFn"] = (a, b) => {
  // Sort order: folders first, then files. Sort folders and files alphabetically
  if ((!a.file && !b.file) || (a.file && b.file)) {
    // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
    // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
    return a.displayName.localeCompare(b.displayName, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  }

  if (a.file && !b.file) {
    return 1
  } else {
    return -1
  }
}
