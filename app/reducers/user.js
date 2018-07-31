
// User reducer

const userInitialState = {
    ID: '007',
  }

export default function user( state = userInitialState, action ){
    
    console.log('this is user');

    switch ( action.type ) {
        case 'SET_CART_NUM': return {
            ID: action.value
        };
        default:
            return state;
    }
}