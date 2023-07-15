// // import axios from 'axios';

// const googleBooksAPI = axios.create({
//   baseURL: 'https://www.googleapis.com/books/v1/',
// });

// export const searchBooks = async (searchQuery) => {
//   try {
//     const response = await googleBooksAPI.get('volumes', {
//       params: {
//         q: searchQuery,
//       },
//     });

//     // Process the response data from the Google Books API
//     const books = response.data.items.map((item) => {
//       const { title, authors, description } = item.volumeInfo;
//       return {
//         title,
//         author: authors.join(', '),
//         description,
//       };
//     });

//     return books;
//   } catch (error) {
//     console.log('An error occurred while searching for books:', error);
//     throw error;
//   }
// };

// export const getBookById = async (bookId) => {
//   try {
//     const response = await googleBooksAPI.get(`volumes/${bookId}`);
//     const bookData = response.data.volumeInfo;
//     const book = {
//       title: bookData.title,
//       author: bookData.authors.join(', '),
//       description: bookData.description,
//       thumbnail: bookData.imageLinks?.thumbnail, // Retrieve the thumbnail image URL if available
//     };
//     return book;
//   } catch (error) {
//     console.log('An error occurred while retrieving the book:', error);
//     throw error;
//   }
// };

// export const addBook = async (book) => {
//   try {
//     const response = await axiosInstance.post('/books', book);
//     return response.data;
//   } catch (error) {
//     console.log('An error occurred while adding the book:', error);
//     throw error;
//   }
// };

import axios from 'axios';

const googleBooksAPI = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1/'
});

export const searchBooks = async (searchQuery, category) => {
  try {
    const response = await googleBooksAPI.get('volumes', {
      params: {
        q: `${searchQuery} ${category ? `subject:${category}` : ''}`
      }
    });
    console.log(response.data.items);

    // Process the response data from the Google Books API
    const books = response.data.items.map(item => {
      console.log(item);
      const {
        title,
        authors,
        description,
        imageLinks,
        industryIdentifiers,
        categories
      } = item.volumeInfo;
      const thumbnail = imageLinks?.thumbnail || '';
      const category = categories ? categories[0] : undefined;
      const isbn = getISBN13(industryIdentifiers);
      return {
        title,
        author: authors,
        description,
        thumbnail,
        category,
        id: item.id,
        isbn
      };
    });

    return books;
  } catch (error) {
    console.log('An error occurred while searching for books:', error);
    throw error;
  }
};

const getISBN13 = industryIdentifiers => {
  const isbn13Identifier = industryIdentifiers.find(
    identifier => identifier.type === 'ISBN_13'
  );
  return isbn13Identifier ? isbn13Identifier.identifier : '';
};

export const getBookById = async bookId => {
  try {
    const response = await googleBooksAPI.get(`volumes/${bookId}`);
    const bookData = response.data.volumeInfo;
    const { thumbnail } = bookData.imageLinks ?? {};

    const book = {
      title: bookData.title,
      author: bookData.authors?.join(', '),
      description: bookData.description,
      thumbnail
    };
    return book;
  } catch (error) {
    console.log('An error occurred while retrieving the book:', error);
    throw error;
  }
};
