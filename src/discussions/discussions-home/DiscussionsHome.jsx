import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  generatePath, Route, Switch, useHistory, useRouteMatch,
} from 'react-router';

import { PostActionsBar } from '../../components';
import { Routes } from '../../data/constants';
import { CommentsView } from '../comments';
import { BreadcrumbMenu, NavigationBar } from '../navigation';
import { PostEditor, PostsView } from '../posts';
import { clearRedirect } from '../posts/data';
import { TopicsView } from '../topics';

export default function DiscussionsHome() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { params } = useRouteMatch(Routes.DISCUSSIONS.PATH);
  const postEditorVisible = useSelector(state => state.threads.postEditorVisible);
  const redirectToThread = useSelector(state => state.threads.redirectToThread);
  useEffect(() => {
    // After posting a new thread we'd like to redirect users to it, the topic and post id are temporarily
    // stored in redirectToThread
    if (redirectToThread) {
      dispatch(clearRedirect());
      history.push(generatePath(Routes.COMMENTS.PAGES['my-posts'], {
        courseId: params.courseId,
        postId: redirectToThread.threadId,
      }));
      dispatch(fetchCourseSettings(params.courseId));
    }
  }, [redirectToThread]);

  return (
    <main className="container my-4 d-flex flex-row">
      <div className="d-flex flex-column w-50 mr-1">
        <Route path={Routes.DISCUSSIONS.PATH} component={NavigationBar} />
        <Route
          path={[
            Routes.POSTS.PATH,
            Routes.TOPICS.CATEGORY,
          ]}
          component={BreadcrumbMenu}
        />
        <div className="card">
          <Switch>
            <Route path={Routes.POSTS.MY_POSTS}>
              <PostsView showOwnPosts />
            </Route>
            <Route path={[Routes.POSTS.PATH, Routes.POSTS.ALL_POSTS]} component={PostsView} />
            <Route path={Routes.TOPICS.PATH} component={TopicsView} />
          </Switch>
        </div>
      </div>
      <div className="d-flex w-50 pl-1 flex-column">
        <PostActionsBar />
        {
          postEditorVisible ? (
            <Route path={Routes.POSTS.NEW_POST}>
              <PostEditor />
            </Route>
          ) : (
            <Switch>
              <Route path={Routes.POSTS.EDIT_POST}>
                <PostEditor editExisting />
              </Route>
              <Route path={Routes.COMMENTS.PATH}>
                <CommentsView />
              </Route>
            </Switch>
          )
        }
      </div>
    </main>
  );
}
