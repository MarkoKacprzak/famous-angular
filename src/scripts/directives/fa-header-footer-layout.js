/**
 * @ngdoc directive
 * @name faHeaderFooterLayout
 * @module famous.angular
 * @restrict EA
 * @description
 * This directive will create a Famo.us HeaderFooterLayout containing
 * a Header, Content, and Footer based on the order of its child elements.
 *  See [https://famo.us/docs/views/HeaderFooterLayout]
 *
 * @usage
 * ```html
 * <fa-header-footer-layout>
 *   <!-- header rendernode -->
 *   <!-- content rendernode -->
 *   <!-- footer rendernode -->
 * </fa-header-footer-layout>
 * ```
 * @example
 * `Fa-header-footer` is a View that arranges three renderables into a header and footer area with defined sizes, and a content area that fills up the remaining space.
 *
 * To use it, declare it in the html and nest 3 renderables inside.  In the example below, there are three direct children elements: a Modifier (with an `fa-surface` nested inside), a Surface, and another Modifier (with an `fa-surface` nested inside).  The order that they are declared in the html determines whether each corresponds to a header, content, and footer.
 *
 * Since the header and footer Modifiers have fixed heights of `[undefined, 75]` (fill the parent container horizontally, 75 pixels vertically), the content will fill the remaining height of the parent modifier or context.
 *
 *```html
 * <fa-header-footer-layout>
 *   <!-- header -->
 *   <fa-modifier fa-size="[undefined, 75]">
 *     <fa-surface fa-background-color="'red'">Header</fa-surface>
 *   </fa-modifier>
 *
 *   <!-- content -->
 *   <fa-surface fa-background-color="'blue'">Content</fa-surface>
 *
 *   <!-- footer -->
 *   <fa-modifier fa-size="[undefined, 75]">
 *     <fa-surface fa-background-color="'green'">Footer</fa-surface>
 *   </fa-modifier>
 * </fa-header-footer-layout>
 *```
 *
 * ## ng-repeat inside a fa-header-footer
 *
 * `Fa-header-footer` works with ng-repeat'ed renderables:
 *
 * ```html
 * <fa-header-footer-layout>
 *   <fa-modifier ng-repeat="view in views" fa-size="view.size" >
 *     <fa-surface fa-background-color="view.bgColor">
 *       {{view.text}}
 *     </fa-surface>
 *   </fa-modifier>
 * </fa-header-footer-layout>
 * ```
 * ```javascript
 * $scope.views = [
 * {bgColor: "red", text: "header", size: [undefined, 100]},
 * {bgColor: "green", text: "content", size: [undefined, undefined]},
 * {bgColor: "blue", text: "footer", size: [undefined, 100]}
 * ];
 * ```
 * In the example above, 3 renderables are generated through an ng-repeat.  The header and footer `Modifier`s generated by the ng-repeat have defined sizes of `[undefined, 100]` (they will fill their parent container horizontally, and be 100 pixels vertically).  The content has a size of `[undefined, undefined]`, and it will fill the remaining heght and width of its container.
 *
 * Note: If more than 3 renderables are nested inside an `fa-header-footer-layout`, it will throw an error: `fa-header-footer-layout can accept no more than 3 children.`
 *
 */

angular.module('famous.angular')
  .directive('faHeaderFooterLayout', ["$famous", "$famousDecorator", function ($famous, $famousDecorator) {
    return {
      template: '<div></div>',
      restrict: 'E',
      transclude: true,
      scope: true,
      compile: function (tElem, tAttrs, transclude) {
        var HeaderFooterLayout = $famous["famous/views/HeaderFooterLayout"];
        var RenderNode = $famous["famous/core/RenderNode"];
        return {
          pre: function (scope, element, attrs) {
            var isolate = $famousDecorator.ensureIsolate(scope);

            var _header = new RenderNode();
            var _content = new RenderNode();
            var _footer = new RenderNode();

            var options = scope.$eval(attrs.faOptions) || {};
            isolate.renderNode = new HeaderFooterLayout(options);

            var _numberOfChildren = 0;

            $famousDecorator.sequenceWith(
              scope,
              function(data) {
                _numberOfChildren++;
                if (_numberOfChildren === 1) {
                  isolate.renderNode.header.add(data.renderNode);
                } else if (_numberOfChildren === 2){
                  isolate.renderNode.content.add(data.renderNode);
                } else if (_numberOfChildren === 3){
                  isolate.renderNode.footer.add(data.renderNode);
                } else {
                  throw "fa-header-footer-layout can accept no more than 3 children";
                }
              },
              // TODO: support removing children
              function(childScopeId) {
                throw "unimplemented: fa-header-footer-layout does not support removing children";
              }
            );

          },
          post: function (scope, element, attrs) {
            var isolate = $famousDecorator.ensureIsolate(scope);

            transclude(scope, function (clone) {
              element.find('div').append(clone);
            });

            $famousDecorator.registerChild(scope, isolate);
          }
        };
      }
    };
  }]);
