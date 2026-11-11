// The year the site was last built (deployed). Pages are pre-built, so this is fixed per deploy.
export async function buildYear() {
  return new Date().getFullYear();
}
