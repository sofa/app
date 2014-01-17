module('cc.couchService.tests');

var productData = {
    "queryDetails":{
    "category":"main",
    "categoryName":"Root",
    "showSizeFilter":"true",
    "showColorFilter":"true"
},
"totalCount":"16",
"products":[
    {"id":1036,"sku":"1172","qty":"2","name":"Fassbind Brut de Fut Williams Obstbrand 53,2 % 0,5 l Flasche","price":"53.58","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Brut de Fut Williams Obstbrand 0,5 Liter Flasche<\/strong><\/h3>\n<p><strong>Fassbind Brut de Fut Williams Obstbrand<\/strong> wird in der \u00e4ltesten Destillerie der Schweiz hergestellt. Gebrannt wird mit neuester Technik, aber nach altem, bew\u00e4hrtem Rezept und nat\u00fcrlich mit viel Liebe zum Detail.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-brut-de-fut-williams-obstbrand-53-2-0-5-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"107.16","custom2":"0.5","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_brut_de_fut_williams_obstbrand_50_5_0_5_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_brut_de_fut_williams_obstbrand_50_5_0_5_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Brut de Fut Williams Obstbrand 53,2 % 0,5 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":310,"sku":"1177","qty":10,"name":"Fassbind Framboise Obstbrand 41% 0,7l Obstler Flasche","price":"36.95","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Framboise Obstbrand 0,7l Obstler Flasche<\/strong><\/h3>\n<p><strong>Fassbind Framboise Obstbrand<\/strong> kennt eigentlich jeder, der schon mal in der Schweiz gewesen ist. Mit dieser besonderen <strong>Spezialit\u00e4t<\/strong> \u00fcberzeugen Gastwirte gerne Ihre G\u00e4ste von der herausragenden Brennkunst ihres Landes.<\/p>\n<p><strong>Fassbind Framboise Obstbrand<\/strong> \u00fcberzeugt mit <strong>Geschmack<\/strong> und <strong>Charakter<\/strong>.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-framboise-obstbrand-41-0-7l-obstler-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"52.79","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_framboise_obstbrand_43_0_7l_obstler_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_framboise_obstbrand_43_0_7l_obstler_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Framboise Obstbrand 41% 0,7l Obstler Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":78,"sku":"1185","qty":10,"name":"Fassbind Vieux Berg Kirsch Obstbrand 41% 0,7l Flasche Obstler","price":"41.20","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieux Berg Kirsch Obstbrand 0,7l Flasche Obstler<\/strong><\/h3>\n<p><strong>Fassbind Vieux Berg Kirsch Obstbrand<\/strong> ist wohl der popul\u00e4rste<strong> Obstbrand<\/strong> aus dem Haus <strong>Fassbind<\/strong>.<br \/>\n<strong>Fassbind<\/strong> verbinden die Kenner mit der uralten Schweizer Brenntradition f\u00fcr vollendete <strong>Obstbr\u00e4nde<\/strong>. Jeder der erzeugten <strong>Obstbr\u00e4nde<\/strong>, ist eigentlich ein Meisterwerk an sich. Doch mit dem <strong>Fassbind Vieux Berg Kirsch Obstbrand<\/strong> haben Sie das Flagschiff der breiten Range vor sich.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieux-berg-kirsch-obstbrand-41-0-7l-flasche-obstler","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"58.86","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieux_berg_kirsch_obstbrand_43_0_7l_flasche_obstler.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieux_berg_kirsch_obstbrand_43_0_7l_flasche_obstler.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieux Berg Kirsch Obstbrand 41% 0,7l Flasche Obstler","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":754,"sku":"1187","qty":10,"name":"Fassbind Pfl\u00fcmli Obstbrand 41 % 0,7 l Flasche","price":"33.77","super":"","variants":[],"priceOld":"36.95","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Pfl\u00fcmli Obstbrand 0,7 Liter Flasche<\/strong><\/h3>\n<p><strong>Fassbind Pfl\u00fcmli Obstbrand<\/strong> sorgt f\u00fcr den hervorragenden Ruf <strong>schweizer Obstbr\u00e4nde<\/strong> bei den Kennern und Experten dieser Welt. Es geh\u00f6rt zur Unternehmensphilosophie der <strong>Brennerei Fassbind<\/strong>, das nur qualitativ hochwertigste Rohstoffe und traditionelle Handwerkskunst, im Ergebnis immer einen edlen <strong>Obstbrand<\/strong> hervorbringen. So wurde der <strong>Fassbind Pfl\u00fcmli Obstbrand<\/strong> bereits mehrfach ausgezeichnet und bietet dem Genie\u00dfer ein vollmundiges <strong>Geschmackserlebnis<\/strong>.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-pflumli-obstbrand-41-0-7-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"48.24","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_pfluemli_obstbrand_43_0_7_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_pfluemli_obstbrand_43_0_7_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Pfl\u00fcmli Obstbrand 41 % 0,7 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2436,"sku":"1194","qty":"4","name":"Fassbind Vieille Abricot alter Aprikosenbrand Obstbrand 40% 0,7l Flasche","price":"39.99","super":"","variants":[],"priceOld":"41.91","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Obstbrand Fassbind Vieille Abricot alter Aprikosenbrand 40% 0,7l Flasche<\/strong><\/h3>\n<p>Der <strong>Vieil Abrico<\/strong>t z&auml;hlt zu der Palette der in <strong>Eichenholzf&auml;ssern<\/strong> gereiften <strong>Br&auml;nde<\/strong> (<strong>Les vieilles barriques<\/strong>). Das hei&szlig;t, dass er nach der  Destillation f&uuml;r einen Zeitraum von 10-18 Monaten in den F&auml;ssern reifte,  und anschlie&szlig;end f&uuml;r eine weitere Geschmacksverfeinerung mit  sogenannten <strong>Dosagen<\/strong> veredelt wurde. Diese Dosagen werden in speziellen  Eichenholz-St&auml;nden gewonnen, und sind in&nbsp; klaren Br&auml;nden eingelegte  getrocknete Fr&uuml;chte. Dadurch entwickelt sich ein fruchtig, s&uuml;&szlig;es Aroma  mit einer feinen Barrique-Note, die durch die Lagerung im Fass bedingt  ist. Diesen wunderbaren alten<strong> Aprikosenbrand<\/strong> muss man einfach probiert  haben!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-abricot-alter-aprikosenbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"57.13","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_abricot_alter_aprikosenbrand_obstbrand_40_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_abricot_alter_aprikosenbrand_obstbrand_40_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Abricot alter Aprikosenbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2434,"sku":"1196","qty":"25","name":"Fassbind Vieille Poire alter Birnenbrand Obstbrand 40% 0,7l Flasche","price":"35.99","super":"","variants":[],"priceOld":"38.19","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Poire alter Birnenbrand Obstbrand 0,7 Liter Fl.<\/strong><\/h3>\n<p>Der <strong>Fassbind Vieille Poire<\/strong> ist ein <strong>alter Birnenbrand<\/strong> und geh&ouml;rt zur  Gruppe der <strong>Vieille Barriques<\/strong>. Das bedeutet, das Destillat reifte f&uuml;r  einen Zeitraum von 10-18 Monaten in <strong>Eichenholzf&auml;ssern<\/strong> und wurde  anschlie&szlig;end zur Geschmacksverfeinerung veredelt. Dabei werden dem  Obstbrand sogenannte Dosagen hinzugegeben. Die Dosagen werden in  speziellen Eichenholzst&auml;nden gewonnen, und zwar durch das Einlegen  getrockneter Fr&uuml;chte in klare Br&auml;nde. Die durch die Veredlung  entstehende intensive <strong>Williamsnote<\/strong> macht den <strong>Fassbind Vieille Poire<\/strong> besonders fruchtig. Zusammen mit der feinen S&uuml;&szlig;e und Noten aus  Eichenholz wird der <strong>Fassbind Vieille Poire<\/strong> zum Geschmackserlebnis.  Dieses brachte ihm 2003 beim schweizer Schnaps Forum die <strong>goldene  Vignette<\/strong> ein, 2005 wurde dem <strong>Obstbrand<\/strong> bei der International Wine &amp;  Spirit Competion die <strong>Silbermedaille<\/strong> verliehen und 2007 gab es ebenfalls  eine silberne Ehrung bei der Distiswiss.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-poire-alter-birnenbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"51.41","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_poire_alter_birnenbrand_obstbrand_40_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_poire_alter_birnenbrand_obstbrand_40_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Poire alter Birnenbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2435,"sku":"1199","qty":"2","name":"Fassbind Vieille Pomme alter Apfelbrand Obstbrand 40% 0,7l Flasche","price":"39.99","super":"","variants":[],"priceOld":"41.91","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Poire alter Apfelbrand Obstbrand 40% 0,7Liter Fl.<\/strong><\/h3>\n<p>Der<strong> Fassbind Vieille Pomme<\/strong> ist ein<strong> alter Obstbrand<\/strong>, der f&uuml;r einen  Zeitraum von einem Jahr in Eichenholzf&auml;ssern lagerte, bevor er zur  Geschmacksverfeinerung mit einer hausgemachten Dosage veredelt wurde.  Das Ergebnis ist ein eleganter K&ouml;rper mit einem intensiven fruchtigen  Apfelaroma. In Verbindung mit der leichten holzigen Note, ist der <strong> Fassbind Vieille Pomme<\/strong> ein absolutes Geschmackserlebnis.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-pomme-alter-apfelbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"57.13","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_pomme_alter_apfelbrand_obstbrand_40_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_pomme_alter_apfelbrand_obstbrand_40_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Pomme alter Apfelbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":204,"sku":"1202","qty":10,"name":"Fassbind Vieille Prune Obstbrand Pflaume 40% 0,7l Flasche","price":"33.77","super":"","variants":[],"priceOld":"38.19","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Prune Obstbrand 40% 0,7l Flasche<\/strong><\/h3>\n<p>Grundlage des <strong>Fassbind Vieille Prune Obstbrandes<\/strong> sind feinstes <strong>Pflaumen<\/strong> Destillate. Diese verleihen ihm sein unnachahmliches <strong>Aroma<\/strong> und einen erstklassigen <strong>Geschmack<\/strong>. Nach der Destillation \u00fcbergibt man den <strong>Fassbind Vieille Prune Obstbrand<\/strong> den Reifeprozess.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"48.24","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_prune_obstbrand_pflaume_43_0_7l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_prune_obstbrand_pflaume_43_0_7l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Prune Obstbrand Pflaume 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":662,"sku":"1204","qty":"1","name":"Fassbind Obstbrand Walderdbeeren R\u00e9serve Priv\u00e9e 43 % 0,5 l Flasche","price":"99.37","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Walderdbeeren R\u00e9serve Priv\u00e9e 0,5 l Obstbrand<\/strong><\/h3>\n<p><strong>Fassbind Walderdbeeren R\u00e9serve Priv\u00e9e<\/strong> ist ein ausgezeichnetes Produkt und bietet dem wahren Genie\u00dfer ein vollmundiges<strong> Geschmackserlebnis<\/strong>. Mehrfach wurde der <strong>Fassbind Walderdbeeren R\u00e9serve Priv\u00e9e<\/strong> bereits f\u00fcr seine <strong>Qualit\u00e4t<\/strong> und einzigartigen <strong>Geschmack<\/strong> ausgezeichnet und wird auch Sie mit seinem <strong>Aromareichtum <\/strong>vollkommen \u00fcberzeugen.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-obstbrand-walderdbeeren-reserve-privee-43-0-5-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Farbe":"Nein","Lieferzeit":"3-4 Tage"},"custom1":"198.74","custom2":"0.5","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/w\/a\/walderdbeere_hochwertig.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/w\/a\/walderdbeere_hochwertig.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Obstbrand Walderdbeeren R\u00e9serve Priv\u00e9e 43 % 0,5 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":1089,"sku":"1206","qty":10,"name":"Fassbind Wildkirsch Reserve Privee Obstbrand 41 % 0,5 l Flasche","price":"108.03","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Wildkirsch Reserve Privee Obstbrand 0,5 Liter Flasche <\/strong><\/h3>\n<p><strong>Fassbind Wildkirsch Reserve Privee Obstbrand<\/strong> ist entstanden durch ein tragisches Ungl\u00fcck im Jahre 1806, wo das Dorf Goldau und noch 2 andere D\u00f6rfer durch gewaltige Felsst\u00fcrze vernichtet wurden. Die riesige Wunde am Berg war der Vorl\u00e4ufer f\u00fcr eine wilde und faszinierende Flora. Kleine seltene aber z\u00e4he Gew\u00e4chse von <strong>Wildkirschen<\/strong> sind ein Teil der Natur.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-wildkirsch-reserve-privee-obstbrand-41-0-5-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"216.06","custom2":"0.5","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_wildkirsch_reserve_privee_obstbrand_43_0_5_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_wildkirsch_reserve_privee_obstbrand_43_0_5_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Wildkirsch Reserve Privee Obstbrand 41 % 0,5 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":722,"sku":"1208","qty":"1","name":"Fassbind Williams Obstbrand 41 % 0,7 l Flasche","price":"36.95","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Williams Obstbrand 0,7 Liter Flasche<\/strong><\/h3>\n<p><strong>Fassbind Williams Obstbrand<\/strong> ist einer der Klassiker im bew\u00e4hrten Sortiment dieses Herstellers mit dem hervorragenden Ruf unter Kennern. Weit \u00fcber die Landesgrenzen der <strong>Schweiz<\/strong> ist das Unternehmen <strong>Fassbind <\/strong>bekannt f\u00fcr \u00fcberragende <strong>Qualit\u00e4t<\/strong> und ausgezeichnete G\u00fcte. Nehmen Sie Teil an dem vollendet hohen Geschmackserlebnis, das ihnen der <strong>Fassbind Williams Obstbrand<\/strong> bietet.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-williams-obstbrand-41-0-7-l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Lieferzeit":"3-4 Tage"},"custom1":"52.79","custom2":"0.7","custom3":"","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_williams_obstbrand_43_0_7_l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_williams_obstbrand_43_0_7_l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Williams Obstbrand 41 % 0,7 l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2637,"sku":"3333","qty":"1","name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Port Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Obstbrand Fassbind Les Cuv&eacute;es Speciales Kirsch Port Cask Finished 41% 0,35l Flasche<\/strong><\/h3>\n<p>Dieser <strong>Kirschbrand<\/strong> lagerte f&uuml;r ein Jahr in einem <strong>portugiesischen Porto Presidential Fass<\/strong>. Diese Lagerung verhalf dem <strong>Obstbrand<\/strong> zu einem dezenten <strong>Portweincharakter<\/strong> mit einem Hauch Marzipan. Da f&uuml;r die Reihe der <strong>&lsquo;Les cuv&eacute;es speciales&lsquo;<\/strong> nur ein Portweinfass mit Kirschbrand gef&uuml;llt wurde, ist der <strong>Kirsch Port Cask Finished<\/strong> in einer <strong>streng limitierten Anzahl von 402 Flaschen<\/strong> erh&auml;ltlich. Sichern Sie sich deshalb schnell eine Flasche der hervorragenden Kreation.<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-port-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_port_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_port_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Port Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2638,"sku":"3334","qty":10,"name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Rum Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Fassbind Les Cuv&eacute;es Speciales Kirsch Rum Cask Finished Obstbrand 41% 0,35l Flasche<\/strong><\/h3>\n<p>Der <strong>Kirsch Rum Cask Finished<\/strong>&nbsp; der Reihe <strong>&lsquo;Les cuv&eacute;es speciales&lsquo;<\/strong> von Fassbind ist ein <strong>vollmundiger Kirschbrand<\/strong> mit einem unverkennbaren <strong>Angostura-Rum-Aroma<\/strong> entstanden. Da Fassbind nur ein <strong>Angostura-Fass<\/strong> mit seinem Kirschbrand f&uuml;llte, gibt es den <strong>Kirsch Rum Cask Finished<\/strong> nur in streng <strong>limitierter Auflage<\/strong>. Weltweilt sind 387 Flaschen dieser au&szlig;ergew&ouml;hnlichen und hervorragenden Kirschbrandvariation erh&auml;ltlich. Also schnell zugreifen!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-rum-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_rum_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_rum_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Rum Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2639,"sku":"3335","qty":"1","name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Sherry Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Obstbrand Fassbind Les Cuv&eacute;es Speciales Kirsch mit Sherry Cask Finished 41% 0,35l Flasche<\/strong><\/h3>\n<p>F&uuml;r den <strong>Kirsch Sherry Cask Finished<\/strong> der Reihe <strong>&lsquo;Les cuv&eacute;es speciales&lsquo; <\/strong>wurde das edle <strong>Kirschdestillat<\/strong> in einem <strong>spanischen Sherry-Fass<\/strong> gelagert. Dadurch hat sich eine ganz besondere Kirsch-Mandel-Note entfaltet, die von dem s&uuml;&szlig;lich-bittere Sherryaroma gekonnt unterstrichen wird. Den <strong>Kirsch Sherry Cask Finished<\/strong> gibt es in der <strong>streng limitierten Anzahl von 398 Flaschen<\/strong> auf dem Markt und wird mit Sicherheit nach kurzer Zeit vergriffen sein. Also schlagen Sie schnell zu!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-sherry-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_sherry_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_sherry_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Sherry Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2640,"sku":"3336","qty":10,"name":"Fassbind Les Cuv\u00e9es Speciales Kirsch Whisky Cask Finished Obstbrand 41% 0,35l Flasche","price":"55.55","super":"","variants":[],"priceOld":"60.99","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Der Fassbind Les Cuv&eacute;es Speciales Kirsch Whisky Cask Finished Obstbrand 41% 0,35 Liter Fl.<\/strong><\/h3>\n<p>F&uuml;r den <strong>Kirsch Whisky Cask Finished<\/strong> &nbsp;lagerte der unnachahmliche <strong>Kirschbrand<\/strong> von <strong>Fassbind<\/strong> f&uuml;r ein Jahr in einem Whiskyfass der <strong>schottischen Tobermoy Destillerie<\/strong>. Diese Lagerung verhalf ihm zu einem&nbsp; angenehmen rauchigen und&nbsp; torfigen Geschmack, dem typischen Aroma <a title=\"Single Malt Whisky\" href=\"http:\/\/www.dasgibtesnureinmal.de\/spirituosen\/whisky\/scotch-pure-malt-whisky.html\" target=\"_blank\"><strong>schottischer Single Malts<\/strong><\/a>. Diese Kirschbrand-Variation der Reihe <strong>&lsquo;Les cuv&eacute;es speciales&lsquo;<\/strong> &uuml;berzeugt Obstbrandkenner und Whiskyliebhaber gleicherma&szlig;en. Da n nur ein Fass mit dieser Kreation existierte, gibt es den <strong>Kirsch Whisky Cask Finished<\/strong> in der streng&nbsp; limitierten Auflage von 418 Flaschen. Also sichern Sie sich schnell diese ungew&ouml;hnliche Variation des edlen <strong>Kirschbrands<\/strong>!<\/p>\n<p><strong><br \/><\/strong><\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-les-cuvees-speciales-kirsch-whisky-cask-finished-obstbrand-41-0-35l-flasche","tax":"19","attributes":{"Gewicht":"1.0000","Lieferzeit":"3-4 Tage"},"custom1":"158.71","custom2":"0.35","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_whisky_cask_finished_obstbrand_41_0_35l_flasche.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_les_cuv_es_speciales_kirsch_whisky_cask_finished_obstbrand_41_0_35l_flasche.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Les Cuv\u00e9es Speciales Kirsch Whisky Cask Finished Obstbrand 41% 0,35l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"},

    {"id":2720,"sku":"3373","qty":10,"name":"Fassbind Vieille Framboise alter Himbeerbrand Obstbrand 40% 0,7l Flasche","price":"38.19","super":"","variants":[],"priceOld":"0.00","inStock":"false","retailer":"","retailerId":"44","locale":"de_DE","description":"<h3><strong>Fassbind Vieille Framboise alter Himbeerbrand Obstbrand 0,7l Flasche.<\/strong><\/h3>\n<p>Der <strong>Fassbind Vieille Framboise<\/strong> ist ein <strong>alter Himbeerbrand<\/strong>, der nach einem alten Hausrezept des Unternehmens <strong>Fassbind<\/strong> hergestellt und destilliert wurde, und anschlie&szlig;end f&uuml;r die Dauer eines Jahres im&nbsp; Eichenholzfass lagerte.&nbsp; Auf diese Weise hat der <strong>Fassbind Vieille Framboise<\/strong> sein unnachahmliches <strong>Barrique-Aroma <\/strong>angenommen, das f&uuml;r die gesamte Reihe der <strong>Fassbind Vieille Barriques<\/strong> kennzeichnend ist.&nbsp; Zu diesem Eichenholzaroma gesellt sich ein angenehmer und &uuml;beraus fruchtiger Himbeergeschmack, der ein wenig an Himbeerkonfit&uuml;re erinnert.&nbsp; Der <strong>Fassbind Vieille Framboise<\/strong> ist ein absolutes Muss f&uuml;r die Liebhaber der edlen <a title=\"Obstbr&auml;nde von Fassbind\" href=\"http:\/\/www.dasgibtesnureinmal.de\/spirituosen\/obstbrande\/fassbind.html\" target=\"_blank\"><strong>Obstbr&auml;nde aus dem Hause Fassbind<\/strong><\/a>!<\/p>","brandName":"","brandId":"","brandUrl":"","url":"","urlKey":"fassbind-vieille-framboise-alter-himbeerbrand-obstbrand-40-0-7l-flasche","tax":"19","attributes":{"Gewicht":"1.7500","Farbe":"Nein","Lieferzeit":"3-4 Tage"},"custom1":"54.56","custom2":"0.7","custom3":"L","images":[{"sizeName":"Small","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_framboise.jpg"},{"sizeName":"Large","url":"http:\/\/www.dasgibtesnureinmal.de\/\/media\/catalog\/product\/f\/a\/fassbind_vieille_framboise.jpg"}],"imagesAlt":[],"colors":[],"sizes":[],"categories":["jacke"],"categoryNames":[""],"seeMoreLabel":"Fassbind Vieille Framboise alter Himbeerbrand Obstbrand 40% 0,7l Flasche","seeMoreUrl":"","gender":"","extractDate":"2013-03-22"}
]
};

var categories = {
        'label': 'root',
        'urlId': 'root',
        'children': [{
            'label': 'child 1',
            'urlId': 'child1',
            'children': [{
                'label': 'child2',
                'urlId': 'child2'
            }]
        }, {
            'label': 'child 2',
            'urlId': 'child2',
            'children': [{
                'label': 'grandchild 4',
                'urlId': 'grandchild4'
            }, {
                'label': 'grandchild 5',
                'urlId': 'grandchild5'
            }]
        }]
    };

var createHttpService = function(){
    return new cc.mocks.httpService(new cc.QService());
};

var createCouchService = function(httpService){
    return new cc.CouchService(httpService, new cc.QService(), new cc.ConfigService());
};

test('can create CouchService instance', function() {
    var couchService = createCouchService(createHttpService());
    ok(couchService, 'Created couchService instance' );
});

test('it should detect direct parent<->child relationships', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        parent: a
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAParentOfB(a, b), 'a is a parent of b' );
    ok(couchService.isAParentOfB(b, a) === false, 'b is not a parent of a');

    ok(couchService.isAChildOfB(b, a), 'b is a child of a' );
    ok(couchService.isAChildOfB(a, b) === false, 'a is not a child of b');
});

test('it should detect indirect parent<->child relationships', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        parent: a
    };

    var c = {
        urlId: 'c',
        parent: b
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAParentOfB(a, c), 'a is a parent of c' );
    ok(couchService.isAParentOfB(c, a) === false, 'c is not a parent of a');

    ok(couchService.isAChildOfB(c, a), 'c is a child of a' );
    ok(couchService.isAChildOfB(a, c) === false, 'a is not a child of c');
});

test('it should detect a being a child alias of b', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        children:[
            { urlId: 'x'},
            { urlId: 'a'}
        ]
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAChildAliasOfB(a, b), 'a is a child alias of b');
    // ok(couchService.isAParentOfB(b, a) === false, 'b is not a parent of a');

    // ok(couchService.isAChildOfB(b, a), 'b is a child of a' );
    // ok(couchService.isAChildOfB(a, b) === false, 'a is not a child of b');
});

test('it should detect no relationship', function() {

    var a = {
        urlId: 'a'
    };

    var b = {
        urlId: 'b',
        parent: a
    };

    var a2 = {
        urlId: 'a2'
    };

    var b2 = {
        urlId: 'b2',
        parent: a2
    };

    var couchService = createCouchService(createHttpService());

    ok(couchService.isAParentOfB(a, b2) === false, 'a is not a parent of b2');
    ok(couchService.isAChildOfB(a, b2) === false, 'a is not a child of b2');

    ok(couchService.isAParentOfB(b2, a) === false, 'b2 is not a parent of a');
    ok(couchService.isAChildOfB(b2, a) === false, 'b2 is not a child of a');
});


asyncTest('can get category', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'child1';

    var url =cc.Config.categoryJson;

    httpService.when('get', url).respond(categories);

    var couchService = createCouchService(httpService);

    couchService
        .getCategory(categoryUrlId)
        .then(function(data){
            ok(data.label === 'child 1', 'got root category');
            start();
        });
});

asyncTest('if a category has aliases it should return the category with children', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'child2';

    var url =cc.Config.categoryJson;

    httpService.when('get', url).respond(categories);

    var couchService = createCouchService(httpService);

    couchService
        .getCategory(categoryUrlId)
        .then(function(data){
            ok(data.label === 'child 2', 'got root category');
            ok(data.children && data.children.length === 2, 'returned the category with children');
            start();
        });
});

asyncTest('can get products', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProducts(categoryUrlId)
        .then(function(data){
            ok(data.length === 16, 'retrieves 16 products');
            start();
        });
});

asyncTest('can get a single product', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 204, 'retrieves product with id 204');
            start();
        });
});

asyncTest('can get the next product of the same category (with cached products)', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 204, 'retrieves product with id 204');

            couchService
                .getNextProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 662, 'retrieves the next product');
                    start();
                });
        });
});

asyncTest('can get the next product of the same category (WITHOUT cached products)', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-prune-obstbrand-pflaume-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    var product = {
        urlKey: productUrlId,
        categoryUrlId: categoryUrlId
    };

    couchService
                .getNextProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 662, 'retrieves the next product');
                    start();
                });
});

asyncTest('returns "null" for the next product when reached the end', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-framboise-alter-himbeerbrand-obstbrand-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 2720, 'retrieves product with id 2720');

            couchService
                .getNextProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct === null, 'has no further product');
                    start();
                });
        });
});

asyncTest('returns the first product of the category for the next product when reached the end and using the circle parameter', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-vieille-framboise-alter-himbeerbrand-obstbrand-40-0-7l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 2720, 'retrieves product with id 2720');

            couchService
                .getNextProduct(product, true)
                .then(function(nextProduct){
                    ok(nextProduct.id === 1036, 'returns the first product because of the circle parameter');
                    start();
                });
        });
});

asyncTest('can get the previous product of the same category (with cached products)', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-obstbrand-walderdbeeren-reserve-privee-43-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 662, 'retrieves product with id 662');

            couchService
                .getPreviousProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 204, 'retrieves the previous product');
                    start();
                });
        });
});

asyncTest('can get the previous product of the same category (WITHOUT cached products)', function() {
    expect(1);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-obstbrand-walderdbeeren-reserve-privee-43-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    var product = {
        urlKey: productUrlId,
        categoryUrlId: categoryUrlId
    };

    couchService
                .getPreviousProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct.id === 204, 'retrieves the previous product');
                    start();
                });
});

asyncTest('returns null for the previous product when reached the start', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-brut-de-fut-williams-obstbrand-53-2-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 1036, 'retrieves product with id 662');

            couchService
                .getPreviousProduct(product)
                .then(function(nextProduct){
                    ok(nextProduct === null, 'has no previous product');
                    start();
                });
        });
});

asyncTest('returns the last product of the category for the previous product when reached the start and using the circle parameter', function() {
    expect(2);
    var httpService = createHttpService();

    var categoryUrlId = 'root';
    var productUrlId = 'fassbind-brut-de-fut-williams-obstbrand-53-2-0-5-l-flasche';

    //it's a bit whack that we have to know the exact URL to mock the http request
    //but on the other hand, how should it work otherwise?
    var url =cc.Config.apiUrl +
                '?&stid=' +
                cc.Config.storeCode +
                '&cat=' + categoryUrlId +
                '&callback=JSON_CALLBACK';

    httpService.when(cc.Config.apiHttpMethod, url).respond(productData);

    var couchService = createCouchService(httpService);

    couchService
        .getProduct(categoryUrlId, productUrlId)
        .then(function(product){
            ok(product.id === 1036, 'retrieves product with id 662');

            couchService
                .getPreviousProduct(product, true)
                .then(function(nextProduct){
                    ok(nextProduct.id === 2720, 'returns the last product of the category');
                    start();
                });
        });
});

