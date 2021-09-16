/* eslint-disable import/prefer-default-export */
import { ensureConfig, getConfig, snakeCaseObject } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { Routes } from '../../../data/constants';

ensureConfig([
  'LMS_BASE_URL',
], 'Comments API service');

const apiBaseUrl = getConfig().LMS_BASE_URL;

const commentsApiUrl = `${apiBaseUrl}/api/discussion/v1/comments/`;

/**
 * Returns all the comments for the specified thread.
 * @param {string} threadId
 * @param {number=} page
 * @param {number=} pageSize
 * @returns {Promise<{}>}
 */
export async function getThreadComments(
  threadId, {
    page,
    pageSize,
  } = {},
) {
  const params = snakeCaseObject({
    threadId,
    page,
    pageSize,
    requestedFields: 'profile_image',
  });

  const { data } = await getAuthenticatedHttpClient()
    .get(commentsApiUrl, { params });
  return data;
}

/**
 * Fetches a responses to a comment.
 * @param {string} commentId
 * @param {number=} page
 * @param {number=} pageSize
 * @returns {Promise<{}>}
 */
export async function getCommentResponses(
  commentId, {
    page,
    pageSize,
  } = {},
) {
  const url = `${commentsApiUrl}${commentId}/`;
  const params = snakeCaseObject({
    page,
    pageSize,
    requestedFields: 'profile_image',
  });
  const { data } = await getAuthenticatedHttpClient()
    .get(url, { params });
  return data;
}

/**
 * Posts a comment.
 * @param {string} comment Raw comment data to post.
 * @param {string} threadId Thread ID for thread in which to post comment.
 * @param {string=} parentId ID for a comments parent.
 * @returns {Promise<{}>}
 */
export async function postComment(comment, threadId, parentId) {
  const { data } = await getAuthenticatedHttpClient()
    .post(commentsApiUrl, snakeCaseObject({ threadId, comment, parentId }));
  return data;
}

/**
 * Updates existing comment.
 * @param {string} commentId ID of comment to update.
 * @param {string} comment Raw updated comment data to post.
 * @returns {Promise<{}>}
 */
export async function updateComment(commentId, comment) {
  const url = `${commentsApiUrl}${commentId}/`;

  const { data } = await getAuthenticatedHttpClient()
    .patch(url, { raw_body: comment }, { headers: { 'Content-Type': 'application/merge-patch+json' } });
  return data;
}

/**
 * Deletes existing comment.
 * @param {string} commentId ID of comment to delete
 */
export async function deleteComment(commentId) {
  const url = `${commentsApiUrl}${commentId}/`;
  await getAuthenticatedHttpClient()
    .delete(url);
}

/**
 * Fetches a single post.
 * @param {string} courseId
 * @returns {Promise<{}>}
 */
export async function getCourseSettings(courseId) {
  const url = Routes.DISCUSSIONS.SETTINGS.replace(':courseId', courseId);
  const { data } = await getAuthenticatedHttpClient().get(url);
  return data;
}
