import {
    ASSISTANT_SHOW,
    SET_ASSISTANT,
    ASSISTANT_OPENED,
} from 'root/app/helper/Constant';

const initialState = {
    assistant: null,
    show: false
};

export default function assistant(state = initialState, action) {
    switch (action.type) {
        /* assistant gizle göster */
        case ASSISTANT_SHOW: return {
            ...state,
            show: action.value
        };
        /* asistanı redux yazdırmak */
        case SET_ASSISTANT: {
            return {
                ...state,
                assistant: action.value
            }
        };
        /* sepet sayfası için assistanı aç kapa */
        case ASSISTANT_OPENED: {
            assistantOpened(state);
            return {
                ...state,
            }
        };
        default:
            return state;
    }
}

function assistantOpened(state) {
    const { assistant } = state;
    if (assistant != null)
        assistant.openChat();
}