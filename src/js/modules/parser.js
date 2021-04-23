import _ from 'lodash';
import i18next from './i18next.js';

const parser = new DOMParser();

const getChildContent = (node, selector) => node.querySelector(selector).textContent;

export default (response) => {
  const { contents, status } = response;
  const { url, content_type } = status;

  if (content_type !== 'application/rss+xml; charset=utf-8') {
    throw new Error(i18next.t('errors.does_not_contain_valid_rss'));
  }

  const xml = parser.parseFromString(contents, 'text/xml')
  const channelNode = _.head(xml.getElementsByTagName('channel'));
  const title = getChildContent(channelNode, 'title');
  const description = getChildContent(channelNode, 'description');
  const itemNodeList = channelNode.querySelectorAll('item');

  const posts = Array.from(itemNodeList).map((item) => {
    const title = getChildContent(item, 'title');
    const description = getChildContent(item, 'description');
    const url = getChildContent(item, 'link');
    const id = _.uniqueId();

    return { id, title, description, url };
  });

  return { feed: { url, title, description }, posts };
};