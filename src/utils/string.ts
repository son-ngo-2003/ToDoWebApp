export const normalize = (str: string) => {
    return str
        .toLowerCase()
        .trim() // Remove leading and trailing spaces
        .normalize('NFD') // Convert to normalized form
        .replace(/[\u0300-\u036f]/g, '')  // Remove diacritics
        .replace(/[^a-z0-9\s]/g, ''); // Remove special characters
}

export const isIncluded = (str: string, searchValue: string) => {
    const normalizedStr = normalize(str);
    const normalizedSearchValue = normalize(searchValue);
    return normalizedStr.includes(normalizedSearchValue);
}