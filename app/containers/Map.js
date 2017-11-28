import Map, { stateKey, reducer as gReducer, initialState as giState } from '../components/map';

const reducer = {
    [stateKey]: gReducer,
};

const initialState = {
    [stateKey]: giState,
};

export {
    Map, reducer, stateKey, initialState,
};
