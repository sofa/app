angular.module('cc.angular.templates', ['src/directives/ccElasticViews/elasticViews.tpl.html', 'src/directives/ccFooter/ccfooter.tpl.html', 'src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html', 'src/directives/ccVariantSelector/ccvariantselector.tpl.html', 'src/directives/ccZippy/cczippy.tpl.html']);

angular.module("src/directives/ccElasticViews/elasticViews.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccElasticViews/elasticViews.tpl.html",
    "<div class=\"cc-elastic-views-viewport\">\n" +
    "    <div \n" +
    "        ng-repeat=\"view in views\"\n" +
    "        cc-elastic-views-notifier \n" +
    "        id=\"{{view.name}}\" \n" +
    "        class=\"cc-elastic-views-view\" \n" +
    "        ng-class=\"view.cls\" \n" +
    "        ng-include=\"view.tpl\">\n" +
    "    </div>\n" +
    "<div>");
}]);

angular.module("src/directives/ccFooter/ccfooter.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccFooter/ccfooter.tpl.html",
    "<div class=\"cc-footer-wrapper\">\n" +
    "        <a \n" +
    "            ng-repeat=\"item in items\" \n" +
    "            ng-class=\"{ 'cc-footer-item-wide' : $index % 2 == 0 && $last}\" \n" +
    "            class=\"cc-footer-item\" \n" +
    "            href=\"#/pages/{{item.id}}\">\n" +
    "            {{ item.title }}\n" +
    "            <i class=\"cc-footer-item-icon icon-angle-left icon-2x\"></i>\n" +
    "        </a>\n" +
    "</div>");
}]);

angular.module("src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html",
    "<div class=\"cc-thumbnail-bar\">\n" +
    "    <img \n" +
    "        class=\"cc-thumbnail-bar-image\" \n" +
    "        ng-class=\"$index === selectedImageIndex ? 'cc-thumbnail-active' : ''\"\n" +
    "        ng-click=\"setSelectedImageIndex($index)\" \n" +
    "        ng-repeat=\"image in images\" ng-src=\"{{image.url}}\"/>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccVariantSelector/ccvariantselector.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccVariantSelector/ccvariantselector.tpl.html",
    "<div class=\"cc-variant-selector\">\n" +
    "    <div class=\"cc-variant-selector-select-wrapper\"\n" +
    "         ng-repeat=\"property in properties\">\n" +
    "         <span ng-bind=\"selectedProperties[property]\"></span>\n" +
    "         <span ng-hide=\"selectedProperties[property]\">{{chooseText}} {{property}}</span>\n" +
    "         <i class=\"cc-variant-selector-select-icon icon-chevron-down\"></i>\n" +
    "        <select name=\"{{property}}\"\n" +
    "                class=\"cc-variant-selector-native-select\" \n" +
    "                ng-model=\"selectedProperties[property]\" \n" +
    "                ng-options=\"val for val in variants|ccVariantFilter:selectedProperties:property\">\n" +
    "            <option value=\"\">-- {{chooseText}} {{property}} --</option>\n" +
    "        </select>\n" +
    "    </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccZippy/cczippy.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccZippy/cczippy.tpl.html",
    "<div class=\"cc-zippy\">\n" +
    "    <div class=\"cc-zippy-caption\">\n" +
    "        <span ng-bind=\"caption\"></span>\n" +
    "        <i class=\"cc-zippy-icon\"></i>\n" +
    "    </div>\n" +
    "    <div class=\"cc-zippy-content\" ng-transclude></div>\n" +
    "</div>\n" +
    "");
}]);
