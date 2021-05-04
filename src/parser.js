import _ from 'lodash';
import i18n from './i18next.js';

const parser = new DOMParser();

const getChildContent = (node, selector) => node.querySelector(selector).textContent;

export default (url, contents) => {
  const oDOM = parser.parseFromString(contents, 'text/xml');

  if (oDOM.documentElement.nodeName === 'parsererror') {
    throw new Error(i18n.t('errors.does_not_contain_valid_rss'));
  }

  const channelNode = _.head(oDOM.getElementsByTagName('channel'));
  const itemNodeList = channelNode.querySelectorAll('item');

  const feed = {
    title: getChildContent(channelNode, 'title'),
    description: getChildContent(channelNode, 'description'),
    url
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
