// Allow JSON imports in TypeScript modules across the project.
declare module "*.json" {
  const value: any;
  export default value;
}
