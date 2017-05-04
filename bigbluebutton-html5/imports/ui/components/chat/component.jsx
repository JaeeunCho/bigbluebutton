import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './styles';
import { defineMessages, injectIntl } from 'react-intl';
import MessageForm from './message-form/component';
import MessageList from './message-list/component';
import Icon from '../icon/component';
import ReactTooltip from 'react-tooltip';

const ELEMENT_ID = 'chat-messages';

const intlMessages = defineMessages({
  closeChatLabel: {
    id: 'app.chat.closeChatLabel',
    description: 'aria-label for closing chat button',
  },
  hideChatLabel: {
    id: 'app.chat.hideChatLabel',
    description: 'aria-label for hiding chat button',
  },
});

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      chatID,
      chatName,
      title,
      messages,
      scrollPosition,
      hasUnreadMessages,
      lastReadMessageTime,
      partnerIsLoggedOut,
      isChatLocked,
      actions,
      intl,
    } = this.props;

    let disableTooltip;
    disableTooltip = navigator.userAgent.indexOf('Mobile') == -1 ? false : true;

    return (
      <div className={styles.chat}>
        <header className={styles.header}>
          <div className={styles.title}>
            <Link
              to="/users"
              role="button"
              aria-label={intl.formatMessage(intlMessages.hideChatLabel, { title: title })}>
                <Icon iconName="left_arrow"/> {title}
            </Link>
          </div>
          <ReactTooltip id='CloseChat'
                        place="left"
                        type="dark"
                        effect="solid"
                        disable={disableTooltip}
                        event="mouseenter focusin"
                        eventOff="mouseleave focusout"
                        aria-haspopup='true'
                        role='tooltip'/>
          <div className={styles.closeIcon}>
            {
              ((this.props.chatID == 'public') ?
                null :
                <Link
                  to="/users"
                  role="button"
                  aria-label={intl.formatMessage(intlMessages.closeChatLabel, { title: title })}
                  data-tip={'Close Chat'}
                  data-for={'CloseChat'}>
                    <Icon iconName="close" onClick={() => actions.handleClosePrivateChat(chatID)}/>
                </Link>)
            }

          </div>
        </header>

        <MessageList
          chatId={chatID}
          messages={messages}
          id={ELEMENT_ID}
          scrollPosition={scrollPosition}
          hasUnreadMessages={hasUnreadMessages}
          handleScrollUpdate={actions.handleScrollUpdate}
          handleReadMessage={actions.handleReadMessage}
          lastReadMessageTime={lastReadMessageTime}
          partnerIsLoggedOut={partnerIsLoggedOut}
        />
        <MessageForm
          disabled={isChatLocked}
          chatAreaId={ELEMENT_ID}
          chatTitle={title}
          chatName={chatName}
          handleSendMessage={actions.handleSendMessage}
        />
      </div>
    );
  }
}

export default injectIntl(Chat);
