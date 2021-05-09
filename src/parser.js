import _ from 'lodash';

const parser = new DOMParser();
const getChildContent = (node, selector) => node.querySelector(selector).textContent;

export default (url, contents, i18n) => {
  const oDOM = parser.parseFromString(contents, 'text/xml');
  const channelNode = _.head(oDOM.getElementsByTagName('channel'));

  if (oDOM.documentElement.nodeName === 'parsererror' || !channelNode) {
    throw new Error(i18n.t('errors.does_not_contain_valid_rss'));
  }

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
