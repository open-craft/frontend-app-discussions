import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { ensureConfig, getConfig } from '@edx/frontend-platform';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Button, Spinner } from '@edx/paragon';

import { selectThread } from '../posts/data/selectors';
import { markThreadAsRead } from '../posts/data/thunks';
import Post from '../posts/post/Post';
import { courseSettingsSchemeDivided, selectThreadComments } from './data/selectors';
import { fetchThreadComments } from './data/thunks';
import Reply from './reply/Reply';
import messages from './messages';

ensureConfig(['POST_MARK_AS_READ_DELAY'], 'Comment thread view');

function CommentsView({ intl }) {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const thread = useSelector(selectThread(postId));
  const comments = useSelector(selectThreadComments(postId));
  const courseSchemeDivided = useSelector(courseSettingsSchemeDivided);
  useEffect(() => {
    dispatch(fetchThreadComments(postId));
    const markReadTimer = setTimeout(() => {
      if (thread && !thread.read) {
        dispatch(markThreadAsRead(postId));
      }
    }, getConfig().POST_MARK_AS_READ_DELAY);
    return () => {
      clearTimeout(markReadTimer);
    };
  }, [postId]);
  if (!thread) {
    return (
      <Spinner animation="border" variant="primary" />
    );
  }
  return (
    <div className="discussion-comments d-flex flex-column w-100 ml-3">
      <div className="mb-2">
        <div className="list-group list-group-flush">
          <Post post={thread} showVisibility={courseSchemeDivided} />
          <div className="list-group">
            {comments.map(reply => (
              <div key={reply.id} className="list-group-item list-group-item-action">
                <Reply reply={reply} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="actions d-flex">
        <Button variant="outline-primary" className="rounded-lg">
          {intl.formatMessage(messages.submit)}
        </Button>
      </div>
    </div>
  );
}

CommentsView.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(CommentsView);
