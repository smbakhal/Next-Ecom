import Cookies from 'js-cookie';
import { createContext, useReducer } from 'react';

export const Store = createContext();
const initialState = {
  darkMode: Cookies.get('darkMode') == 'ON' ? true : false,
  cart: {
    cartItems: Cookies.get('cartItems')
      ? JSON.parse(Cookies.get('cartItems'))
      : [],
    shippingAddress: Cookies.get('shippingAddress')
      ? JSON.parse(Cookies.get('shippingAddress'))
      : {},
    paymentMethod: Cookies.get('paymentMethod')
      ? Cookies.get('paymentMethod')
      : '',
  },
  userInfo: Cookies.get('userInfo')
    ? JSON.parse(Cookies.get('userInfo'))
    : null,
  fav: {
    favItems: Cookies.get('favItems')
      ? JSON.parse(Cookies.get('favItems'))
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'DARK_MODE_ON':
      return { ...state, darkMode: true };
    case 'DARK_MODE_OFF':
      return { ...state, darkMode: false };
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        item => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map(item =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        item => item.id !== action.payload.item._id
      );
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: { ...state.cart, shippingAddress: action.payload },
      };
    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };

    case 'USER_LOGIN':
      return { ...state, userInfo: action.payload };
    case 'USER_LOGOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: '',
        },
      };
    case 'FAV_ADD_ITEM': {
      const newItem = action.payload;
      const favItems = [...state.fav.favItems, newItem];
      Cookies.set('favItems', JSON.stringify(favItems));
      return { ...state, fav: { ...state.fav, favItems } };
    }
    case 'FAV_REMOVE_ITEM': {
      const removeItem = action.payload;

      const favItems = state.fav.favItems.filter(
        item => item._id !== removeItem._id
      );

      Cookies.set('favItems', JSON.stringify(favItems));
      return { ...state,fav: { ...state.fav, favItems }  };
    }

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
