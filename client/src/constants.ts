

export enum App {
    Background = 'radial-gradient(circle at 74.2% 50.9%, rgb(14, 72, 222) 5.2%, rgb(3, 22, 65) 75.3%)',
    White = '#fff',
    BlackGradient = 'radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%)',
    ErrorTextColor= '#d32f2f',
    DarkBlue='#141a1f'
}

export const CHAT_MESSAGES_PER_SCROLL = 70;
export const INITIAL_PAGE = 1;

export const BACKEND_URL = 'http://localhost:9000'

// export const BACKEND_URL = 'https://tower-connect.onrender.com';

export const AppName = 'The Luvis'

export const Categories = [
    {label: 'Tools', value: 'tools'},
    {label: 'Vehicle', value: 'vehicle'},
    {label: 'Furniture', value: 'furniture'},
    {label: 'Garden', value: 'garden'},
    {label: 'Appliances', value: 'appliances'},
    {label: 'Household', value: 'household'},
    {label: 'Books, Movies, Music', value: 'books-movies-music'},
    {label: 'Video Games', value: 'video-games'},
    {label: 'Jwelery & Accessories', value: 'Jwelery-accessories'},
    {label: 'Bags and Luggage', value: 'Bags-luggage'},
    {label: 'Men Clothing & Shoes', value: 'men-clothing-shoes'},
    {label: 'Women Clothing & Shoes', value: 'women-clothing-shoes'},
    {label: 'Toys & Games', value: 'toys-games'},
    {label: 'Baby & Kids', value: 'baby-kids'},
    {label: 'Pet Supplies', value: 'pet-supplies'},
    {label: 'Health & Beauty', value: 'health-beauty'},
    {label: 'Mobile Phones', value: 'mobile-phones'},
    {label: 'Electronic & Computers', value: 'electronic-computers'},
    {label: 'Sports & Outdoors', value: 'sports-outdoors'},
    {label: 'Musical Instrument', value: 'musical-instrument'},
    {label: 'Arts & Crafts', value: 'arts-crafts'},
    {label: 'Antiques & Collectibles', value: 'antiques-collectibles'},
    {label: 'Auto Parts', value: 'auto-parts'},
    {label: 'Bicycles', value: 'bicycles'},
    {label: 'Miscellaneous', value: 'misc'},
]

export const Condition = [
    {label: 'New', value: 'new'},
    {label: 'Like New', value: 'like-new'},
    {label: 'Old', value: 'old'},
]

export const QUERY_KEYS = {
    FETCH_ALL_LISTINGS: 'fetchAllListings',
    FETCH_MY_LISTING: 'fetchMyListings',
    SEARCH_OWNER: 'search-owners', 
    CREATE_ACCESS_CHAT: 'create-access-chat',
    FETCH_MY_CHATS: 'fetch-my-chats',
    SEND_MESSAGE:'send-message',
    FETCH_MESSAGES: 'fetch-messages',
    FETCH_COMMUNITY_POSTS: 'fetch-community-post',
    FETCH_POST_COMMENTS: 'fetch-post-comments'
}

export const publicPathNames = [
    '/',
    '/login/owner', // Login Page
    '/signup/owner' // Singup Page
]

export const ALLOWED_CHARATERS_COMMUNITY = 280;