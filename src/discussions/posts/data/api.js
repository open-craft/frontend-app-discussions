/* eslint-disable import/prefer-default-export */
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { API_BASE_URL } from '../../../data/constants';

export async function getThreadPost(threadId) {
  const url = new URL(`${API_BASE_URL}/api/discussion/v1/threads/${threadId}/`);
  const { data } = await getAuthenticatedHttpClient()
    .get(url);
  return data;
}

export async function getThreadComments(
  threadId, {
    commentId, page, pageSize, requestedFields,
  } = {},
) {
  const url = new URL(`${API_BASE_URL}/api/discussion/v1/comments/`);
  const paramsMap = {
    thread_id: threadId,
    comment_id: commentId,
    page,
    page_size: pageSize,
    requested_fields: requestedFields,
  };
  Object.keys(paramsMap)
    .forEach(
      (param) => {
        const paramValue = paramsMap[param];
        if (paramValue) {
          url.searchParams.append(param, paramValue);
        }
      },
    );

  const { data } = await getAuthenticatedHttpClient()
    .get(url);
  return data;
}

export async function getCommentReplies(
  commentId, {
    page, pageSize, requestedFields,
  } = {},
) {
  const url = new URL(`${API_BASE_URL}/api/discussion/v1/comments/${commentId}/`);
  const paramsMap = {
    page,
    page_size: pageSize,
    requested_fields: requestedFields,
  };
  Object.keys(paramsMap)
    .forEach(
      (param) => {
        const paramValue = paramsMap[param];
        if (paramValue) {
          url.searchParams.append(param, paramValue);
        }
      },
    );

  const { data } = await getAuthenticatedHttpClient()
    .get(url);
  return data;
}
