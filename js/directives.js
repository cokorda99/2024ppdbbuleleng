angular.module('app.directives', [])

    .directive('excelExport', [function () {
        return {
            restrict: 'A',
            scope: {
                fileName: "@",
                data: "&exportData"
            },
            replace: true,
            template: '<button class="btn btn-primary btn-ef btn-ef-3 btn-ef-3c mb-10" ng-click="download()">Export to Excel <i class="fa fa-download"></i></button>',
            link: function (scope, element) {

                scope.download = function () {

                    function datenum(v, date1904) {
                        if (date1904) v += 1462;
                        var epoch = Date.parse(v);
                        return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
                    };

                    function getSheet(data, opts) {
                        var ws = {};
                        var range = { s: { c: 10000000, r: 10000000 }, e: { c: 0, r: 0 } };
                        for (var R = 0; R != data.length; ++R) {
                            for (var C = 0; C != data[R].length; ++C) {
                                if (range.s.r > R) range.s.r = R;
                                if (range.s.c > C) range.s.c = C;
                                if (range.e.r < R) range.e.r = R;
                                if (range.e.c < C) range.e.c = C;
                                var cell = { v: data[R][C] };
                                if (cell.v == null) continue;
                                var cell_ref = XLS.utils.encode_cell({ c: C, r: R });

                                if (typeof cell.v === 'number') cell.t = 'n';
                                else if (typeof cell.v === 'boolean') cell.t = 'b';
                                else if (cell.v instanceof Date) {
                                    cell.t = 'n'; cell.z = XLS.SSF._table[14];
                                    cell.v = datenum(cell.v);
                                }
                                else cell.t = 's';

                                ws[cell_ref] = cell;
                            }
                        }
                        if (range.s.c < 10000000) ws['!ref'] = XLS.utils.encode_range(range);
                        return ws;
                    };

                    function Workbook() {
                        if (!(this instanceof Workbook)) return new Workbook();
                        this.SheetNames = [];
                        this.Sheets = {};
                    }

                    var wb = new Workbook(), ws = getSheet(scope.data());
                    /* add worksheet to workbook */
                    wb.SheetNames.push(scope.fileName);
                    wb.Sheets[scope.fileName] = ws;
                    var wbout = XLS.write(wb, { bookType: 'xls', bookSST: true, type: 'binary' });

                    function s2ab(s) {
                        var buf = new ArrayBuffer(s.length);
                        var view = new Uint8Array(buf);
                        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                        return buf;
                    }

                    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), scope.fileName + '.xls');

                };

            }
        };


    }])

angular.module('ui.tinymce', [])
    .value('uiTinymceConfig', {})
    .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
        uiTinymceConfig = uiTinymceConfig || {};
        var generatedIds = 0;
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ngModel) {
                var expression, options, tinyInstance;
                // generate an ID if not present
                if (!attrs.id) {
                    attrs.$set('id', 'uiTinymce' + generatedIds++);
                }
                options = {
                    // Update model when calling setContent (such as from the source editor popup)
                    setup: function (ed) {
                        ed.on('init', function (args) {
                            ngModel.$render();
                        });
                        // Update model on button click
                        ed.on('ExecCommand', function (e) {
                            ed.save();
                            ngModel.$setViewValue(elm.val());
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                        // Update model on keypress
                        ed.on('KeyUp', function (e) {
                            console.log(ed.isDirty());
                            ed.save();
                            ngModel.$setViewValue(elm.val());
                            if (!scope.$$phase) {
                                scope.$apply();
                            }
                        });
                    },
                    mode: 'exact',
                    elements: attrs.id
                };
                if (attrs.uiTinymce) {
                    expression = scope.$eval(attrs.uiTinymce);
                } else {
                    expression = {};
                }
                angular.extend(options, uiTinymceConfig, expression);
                setTimeout(function () {
                    tinymce.init(options);
                });


                ngModel.$render = function () {
                    if (!tinyInstance) {
                        tinyInstance = tinymce.get(attrs.id);
                    }
                    if (tinyInstance) {
                        tinyInstance.setContent(ngModel.$viewValue || '');
                    }
                };
            }
        };
    }]);