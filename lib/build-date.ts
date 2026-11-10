// The date the site was last built (deployed). Cached so pages stay pre-built.
export async function buildYear() {
  "use cache";
  return new Date().getFullYear();
}
