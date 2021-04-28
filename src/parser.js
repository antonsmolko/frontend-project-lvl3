import _ from 'lodash';
import i18next from './i18next.js';

const parser = new DOMParser();

const getChildContent = (node, selector) => node.querySelector(selector).textContent;

export default (response) => {
  const { contents, status } = response;
  console.log('contents', contents)
  console.log('response', response)
  const { url, content_type: contentType } = status;

  if (contentType !== 'application/rss+xml; charset=utf-8') {
    throw new Error(i18next.t('errors.does_not_contain_valid_rss'));
  }

  const xml = parser.parseFromString(contents, 'text/xml');
  const channelNode = _.head(xml.getElementsByTagName('channel'));
  const itemNodeList = channelNode.querySelectorAll('item');

  const feed = {
    title: getChildContent(channelNode, 'title'),
    description: getChildContent(channelNode, 'description'),
    url,
  };

  const posts = Array.from(itemNodeList).map((item) => (
    {
      id: _.uniqueId(),
      title: getChildContent(item, 'title'),
      description: getChildContent(item, 'description'),
      url: getChildContent(item, 'link'),
    }
  ));

  return { feed, posts };
};
