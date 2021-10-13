import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { Button, Spinner } from '@edx/paragon';

import { RequestStatus } from '../../data/constants';
import {
  selectAllThreads,
  selectThreadFilters,
  selectThreadNextPage,
  selectThreadSorting,
  selectTopicThreads,
  selectUserThreads,
  threadsLoadingStatus,
} from './data/selectors';
import { fetchThreads } from './data/thunks';
import PostFilterBar from './post-filter-bar/PostFilterBar';
import messages from './messages';
import { PostLink } from './post';

function PostsView({ showOwnPosts, intl }) {
  const {
    courseId,
    topicId,
  } = useParams();
  const dispatch = useDispatch();

  const { authenticatedUser } = useContext(AppContext);
  const orderBy = useSelector(selectThreadSorting());
  const filters = useSelector(selectThreadFilters());
  const nextPage = useSelector(selectThreadNextPage());
  const loadingStatus = useSelector(threadsLoadingStatus());

  let posts = [];
  if (topicId) {
    posts = useSelector(selectTopicThreads(topicId));
  } else if (showOwnPosts) {
    posts = useSelector(selectUserThreads(authenticatedUser.username));
  } else {
    posts = useSelector(selectAllThreads);
  }
  useEffect(() => {
    // The courseId from the URL is the course we WANT to load.
    dispatch(fetchThreads(courseId, {
      orderBy,
      filters,
    }));
  }, [courseId, orderBy, filters]);

  const loadMorePosts = async () => {
    if (nextPage) {
      dispatch(fetchThreads(courseId, {
        orderBy,
        filters,
        page: nextPage,
      }));
    }
  };

  return (
    <div className="discussion-posts d-flex flex-column">
      <PostFilterBar filterSelfPosts={showOwnPosts} />
      {posts && posts.length > 0 && (
        <div className="list-group list-group-flush">
          {posts.map(post => (<PostLink post={post} key={post.id} />))}
        </div>
      )}
      {loadingStatus === RequestStatus.IN_PROGRESS ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" variant="primary" size="lg" />
        </div>
      ) : (
        nextPage && (
          <Button onClick={loadMorePosts}>
            {intl.formatMessage(messages.loadMorePosts)}
          </Button>
        )
      )}
    </div>
  );
}

PostsView.propTypes = {
  showOwnPosts: PropTypes.bool,
  intl: intlShape.isRequired,
};

PostsView.defaultProps = {
  showOwnPosts: false,
};

export default injectIntl(PostsView);
