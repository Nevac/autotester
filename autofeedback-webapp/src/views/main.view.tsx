import './main.view.css';
import ChatBrowserComponent from "../domains/chats/chat-browser/chat-browser.component";
import ChatDetailComponent from "../domains/chats/chat-details/chat-detail.component";

export default function MainView() {

    return (
        <div className={'main-view-container'}>
            <div className={'main-view-column main-view-side'}>
                <ChatBrowserComponent/>
            </div>
            <div className={'main-view-column main-view-content'}>
                <ChatDetailComponent/>
            </div>
        </div>
    );
}