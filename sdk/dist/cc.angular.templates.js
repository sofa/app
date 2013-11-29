angular.module('cc.angular.templates', ['src/directives/ccAddress/ccaddress.tpl.html', 'src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html', 'src/directives/ccCheckBox/cccheckbox.tpl.html', 'src/directives/ccElasticViews/elasticViews.tpl.html', 'src/directives/ccFooter/ccfooter.tpl.html', 'src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html', 'src/directives/ccSelectBox/ccselectbox.tpl.html', 'src/directives/ccThumbnailBar/ccthumbnailbar.tpl.html', 'src/directives/ccVariantSelector/ccvariantselector.tpl.html', 'src/directives/ccZippy/cczippy.tpl.html']);

angular.module("src/directives/ccAddress/ccaddress.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccAddress/ccaddress.tpl.html",
    "<div>\n" +
    "    <div>{{data.company}}</div>\n" +
    "    <div>{{data.name}} {{data.surname}}</div>\n" +
    "    <div>{{data.street}}</div>\n" +
    "    <div>{{data.zip}} {{data.city}}</div>\n" +
    "    <div>{{data.country.label}}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccBreadcrumbs/cc-breadcrumbs.tpl.html",
    "<ul>\n" +
    "    <li class=\"cc-breadcrumbs__entry\" \n" +
    "        ng-repeat=\"entry in data\" \n" +
    "        ng-bind=\"entry.title\">\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("src/directives/ccCheckBox/cccheckbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccCheckBox/cccheckbox.tpl.html",
    "<label for=\"cc-check-box-{{id}}\" class=\"topcoat-checkbox\">\n" +
    "  <input ng-model=\"value\" id=\"cc-check-box-{{id}}\" aria-labelledby=\"cc-check-box-{{id}}-label\" aria-describedby=\"cc-check-box-{{id}}-description\" type=\"checkbox\">\n" +
    "  <div class=\"topcoat-checkbox__checkmark\"></div>\n" +
    "  <span id=\"cc-check-box-{{id}}-label\">{{label}}</span> \n" +
    "</label>");
}]);

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
    "<ul class=\"cc-footer-list\">\n" +
    "    <li bindonce=\"item\" ng-repeat=\"item in items\"\n" +
    "        class=\"cc-footer-list__row\"\n" +
    "        ng-click=\"goTo(item)\" >\n" +
    "        <div class=\"cc-footer-list__row-content\">\n" +
    "            <span bo-text=\"item.title\"></span>\n" +
    "            <i class=\"cc-footer-list__row-icon fa fa-chevron-right\"></i>\n" +
    "        </div>\n" +
    "    </li>\n" +
    "</ul>");
}]);

angular.module("src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccLoadingSpinner/ccloadingspinner.tpl.html",
    "<div class=\"cc-loading-spinner\">\n" +
    "    <!-- generated and tweaked from http://cssload.net/ -->\n" +
    "    <div class=\"cc-loading-spinner__circle--01\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--02\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--03\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--04\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--05\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--06\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--07\"></div>\n" +
    "    <div class=\"cc-loading-spinner__circle--08\"></div>\n" +
    "</div>");
}]);

angular.module("src/directives/ccSelectBox/ccselectbox.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("src/directives/ccSelectBox/ccselectbox.tpl.html",
    "<div class=\"cc-select-box\">\n" +
    "     <span class=\"cc-select-box__display-value\" ng-bind=\"displayFn(_selectedValue)\"></span>\n" +
    "     <span class=\"cc-select-box__display-value\" ng-hide=\"_selectedValue\">{{chooseText}} {{propertyName}}</span>\n" +
    "     <i class=\"cc-select-box__select-icon fa fa-chevron-down\"></i>\n" +
    "    <select name=\"{{propertyName}}\"\n" +
    "            class=\"cc-select-box__native-select\" \n" +
    "            ng-model=\"_selectedValue\" \n" +
    "            ng-options=\"displayFn(val) for val in data\">\n" +
    "        <option ng-if=\"!_omitNull\" value=\"\">-- {{chooseText}} {{propertyName}} --</option>\n" +
    "    </select>\n" +
    "    <span class=\"cc-validation__message--fail\">{{ failMessage }}</span>\n" +
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
    "    <div class=\"cc-select-box\"\n" +
    "         ng-repeat=\"property in properties\">\n" +
    "         <span class=\"cc-select-box__display-value\" ng-bind=\"selectedProperties[property]\"></span>\n" +
    "         <span class=\"cc-select-box__display-value\" ng-hide=\"selectedProperties[property]\">{{chooseText}} {{property}}</span>\n" +
    "         <i class=\"cc-select-box__select-icon fa fa-chevron-down\"></i>\n" +
    "        <select name=\"{{property}}\"\n" +
    "                class=\"cc-select-box__native-select\" \n" +
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
