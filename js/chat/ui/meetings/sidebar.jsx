import React from 'react';
import { MegaRenderMixin } from '../../../stores/mixins.js';
import ComposedTextArea from "../composedTextArea.jsx";
import HistoryPanel from "../historyPanel.jsx";
import Call from './call.jsx';
import Collapse from './collapse.jsx';
import Participants from './participants.jsx';
import Button from './button.jsx';
import StreamNode from './streamNode.jsx';
import { PerfectScrollbar } from '../../../ui/perfectScrollbar';
import Guest from './guest.jsx';

export default class Sidebar extends MegaRenderMixin {
    historyPanel = null;

    state = {
        guest: false
    };

    constructor(props) {
        super(props);
        // TODO: Use the `is_eplusplus` value.
        // Look into setting to `false` after successful registration.
        this.state.guest = Call.isGuest();
    }

    renderHead = () => {
        const { call, view, chatRoom, onSidebarClose, onInviteToggle } = this.props;
        return (
            <div className="sidebar-head">
                <Button
                    simpletip={{ label: l.close_sidebar /* `Close sidebar` */, className: 'theme-dark-forced' }}
                    className="mega-button action small left"
                    icon="icon-collapse-right"
                    onClick={onSidebarClose}>
                    <span>{l.close_sidebar /* `Close sidebar` */}</span>
                </Button>
                {view === Call.VIEW.CHAT && <h2>{l.chats /* `Chats` */}</h2>}
                {view !== Call.VIEW.CHAT && (
                    <>
                        <h2>{l[16217] /* `Participants` */}</h2>
                        {call.isPublic && !is_eplusplus && Call.isModerator(chatRoom, u_handle) && (
                            <Button
                                className="mega-button round positive add"
                                icon="icon-add"
                                onClick={onInviteToggle}>
                                <span>{l[8007] /* `Add participant` */}</span>
                            </Button>
                        )}
                    </>
                )}
            </div>
        );
    };

    renderSpeakerMode = () => {
        const { mode, call, streams, chatRoom, forcedLocal, onSpeakerChange } = this.props;
        const { guest } = this.state;
        const localStream = call.getLocalStream();

        return (
            <div
                className={`
                    sidebar-streams-container
                    ${guest ? 'guest' : ''}
                `}>
                <PerfectScrollbar options={{ 'suppressScrollX': true }}>
                    <Collapse
                        {...this.props}
                        heading={l[16217] /* `Participants` */}
                        badge={streams.length + 1}>
                        <div className="sidebar-streams">
                            <StreamNode
                                mode={mode}
                                chatRoom={chatRoom}
                                stream={localStream}
                                className={forcedLocal ? 'active' : ''}
                                onClick={() => {
                                    mBroadcaster.sendMessage('meetings:collapse');
                                    onSpeakerChange(localStream);
                                }}
                            />
                            {streams.map((stream, index) => {
                                return (
                                    <StreamNode
                                        key={index}
                                        mode={mode}
                                        chatRoom={chatRoom}
                                        stream={stream}
                                        className={
                                            stream.isActive || stream.clientId === call.forcedActiveStream ?
                                                'active' :
                                                ''
                                        }
                                        onClick={onSpeakerChange}
                                    />
                                );
                            })}
                        </div>
                    </Collapse>
                </PerfectScrollbar>
                {guest && <Guest onGuestClose={() => this.setState({ guest: false })} />}
            </div>
        );
    };

    renderChatView = () => {
        const { chatRoom, onDeleteMessage } = this.props;
        return (
            <>
                <HistoryPanel
                    ref={ref => {
                        this.historyPanel = ref;
                    }}
                    chatRoom={chatRoom}
                    className="in-call"
                    onDeleteClicked={onDeleteMessage}
                />
                <ComposedTextArea chatRoom={chatRoom} parent={this} />
            </>
        );
    };

    renderParticipantsView = () => {
        const { call, streams, chatRoom } = this.props;
        return (
            <Participants
                streams={streams}
                call={call}
                chatRoom={chatRoom}
                guest={this.state.guest}
                onGuestClose={participantsListRef =>
                    this.setState({ guest: false }, () => participantsListRef.reinitialise())
                }
            />
        );
    };

    render() {
        const { mode, view } = this.props;

        //
        // `Sidebar`
        // https://mega.nz/file/8UUTQIQT#6WSKPYSkyH9efaZi1WNZocf3GFn0nJpIIat6F1n_7ck
        // https://mega.nz/file/5BVFHaxR#iekG3QCDL7wzGXySrObToLVX8PcjgD1jsQVeA_AHBAE
        // https://mega.nz/file/YcE3wIIC#JxpJWWw3NK6zxnzwUdBbQNEws6RyT8YNCqDaFIYAUvE
        // -------------------------------------------------------------------------

        return (
            <div
                className={`
                    sidebar
                    ${view === Call.VIEW.CHAT ? 'chat-opened' : 'theme-dark-forced'}
                `}>
                {this.renderHead()}
                {view === Call.VIEW.PARTICIPANTS && mode === Call.MODE.SPEAKER && this.renderSpeakerMode()}
                {view === Call.VIEW.CHAT && this.renderChatView()}
                {view === Call.VIEW.PARTICIPANTS && mode === Call.MODE.THUMBNAIL && this.renderParticipantsView()}
            </div>
        );
    }
}
