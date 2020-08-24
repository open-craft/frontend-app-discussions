/* eslint-disable import/prefer-default-export */
export function buildIntlSelectionList(options, intl, messages) {
  return Object.values(options)
    .map(
      option => (
        {
          label: intl.formatMessage(messages[option]),
          value: option,
        }
      ),
    );
}

/**
 * Get HTTP Error status from generic error.
 * @param error Generic caught errot.
 * @returns {number|undefined}
 */
export const getHttpErrorStatus = error => error && error.customAttributes && error.customAttributes.httpErrorStatus;
