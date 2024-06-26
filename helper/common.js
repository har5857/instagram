
// const calculateOffsetAndLimit = (pageNumber, pageSize) => {
//     const offset = (pageNumber - 1) * pageSize;
//     const limit = pageSize;
//     return { offset, limit };
// };

// const fetchUsers = async (pageNumber, pageSize) => {
//     const { offset, limit } = calculateOffsetAndLimit(pageNumber, pageSize);
//     const users = await User.find().skip(offset).limit(limit);
//     return users;
// };

// const getTotalItemCount = async () => {
//     const totalCount = await User.countDocuments();
//     return totalCount;
// };

// const calculateTotalPages = (totalCount, pageSize) => {
//     return Math.ceil(totalCount / pageSize);
// };

// const hasNextPage = (currentPage, totalPages) => {
//     return currentPage < totalPages;
// };

// const hasPreviousPage = (currentPage) => {
//     return currentPage > 1;
// };

// const getPaginationMetadata = async (pageNumber, pageSize) => {
//     const totalCount = await getTotalItemCount();
//     const totalPages = calculateTotalPages(totalCount, pageSize);
//     const hasNext = hasNextPage(pageNumber, totalPages);
//     const hasPrevious = hasPreviousPage(pageNumber);
//     return {
//         totalCount,
//         totalPages,
//         currentPage: pageNumber,
//         hasNext,
//         hasPrevious,
//     };
// };
