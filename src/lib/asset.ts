/** Resolve a file in /public against the deploy base (`/HappyPlate/`). */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;
