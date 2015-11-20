angular.module('demoAngular', ['ui.bootstrap']).controller('ControladorUser', function($scope, $http, $filter) {
    $scope.titulo = "ADMINISTRACIÓN USUARIOS";

    $scope.user = [];

    $scope.text_btnGuardar = 'Guardar';
    $scope.icon_btnGuardar = 'glyphicon-save';
    $scope.class_btnGuardar = 'btn-success';
    $scope.deshabilitar = false;

    $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };

    $scope.format = 'yyyy-MM-dd';

    $scope.initAdminUsuarios = function() {
        $scope.documento = "";
        $scope.nombres = "";
        $scope.apellidos = "";
        $scope.fechaNacimiento = "";
        $scope.sexo = "";
        $scope.ajaxUsuarios();
    };

    $scope.ajaxUsuarios = function() {

        var request = $http({
            method: "POST",
            url: 'ajaxUsuarios.php',
            data: '',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}

        });

        var promise = request.then(function(response) {
            $scope.user = response.data;
        }, function(response) {
            // error
        });

        promise.finally(function() {
        });
    };


    $scope.saveEditUsuario = function() {
        if ($scope.documento != "") {
            if ($scope.text_btnGuardar == 'Guardar') {
                $scope.guardarUsuario();
            } else {
                $scope.editarUsuario();
            }
        } else {
            $scope.mensaje = "El numero de documento es obligatorio";
            $scope.class_text = "danger";
        }
    };

    $scope.editarUsuario = function() {
        $scope.fechaNacimiento = $filter('date')($scope.fechaNacimiento, "yyyy-MM-dd");
        
        $scope.user[$scope.id].nombres = $scope.nombres;
        $scope.user[$scope.id].apellidos = $scope.apellidos;
        $scope.user[$scope.id].fechaNacimiento = $scope.fechaNacimiento;
        $scope.user[$scope.id].sexo = $scope.sexo;

        $scope.limpiaForms();
    };

    $scope.guardarUsuario = function() {
        if ($scope.validaUsuarioRepetido() == false) {
            $scope.fechaNacimiento = $filter('date')($scope.fechaNacimiento, "yyyy-MM-dd");
            $scope.user.push({documento: $scope.documento, nombres: $scope.nombres, apellidos: $scope.apellidos, fechaNacimiento: $scope.fechaNacimiento, sexo: $scope.sexo});
            $scope.class_text = "info";
            $scope.mensaje = "Se ingreso el usuario " + $scope.documento;
            $scope.limpiaForms();
        } else {
            $scope.mensaje = "El usuario ya existe";
            $scope.class_text = "danger";
        }
    };

    $scope.CargaDatosEditarUsuario = function(usuario) {
        $scope.text_btnGuardar = 'Editar';
        $scope.icon_btnGuardar = 'glyphicon-edit';
        $scope.class_btnGuardar = 'btn-primary';
        $scope.deshabilitar = true;

        $scope.documento = usuario.documento;
        $scope.nombres = usuario.nombres;
        $scope.apellidos = usuario.apellidos;
        $scope.fechaNacimiento = usuario.fechaNacimiento;
        $scope.sexo = usuario.sexo;
        $scope.id = $scope.user.indexOf(usuario);
    };

    $scope.eliminarUsuario = function(usuario) {
        $scope.user.splice($scope.user.indexOf(usuario));
        $scope.mensaje = "Se elimino el usuario";
        $scope.class_text = "warning";
    };

    $scope.validaUsuarioRepetido = function() {
        var usuarioRepetido = false;
        angular.forEach($scope.user, function(usuario) {
            if (usuario.documento == $scope.documento && usuarioRepetido === false) {
                usuarioRepetido = true;
            }
        });
        return usuarioRepetido;
    };

    $scope.limpiaForms = function() {
        $scope.text_btnGuardar = 'Guardar';
        $scope.icon_btnGuardar = 'glyphicon-save';
        $scope.class_btnGuardar = 'btn-success';
        $scope.deshabilitar = false;

        $scope.documento = "";
        $scope.nombres = "";
        $scope.apellidos = "";
        $scope.fechaNacimiento = "";
        $scope.sexo = "";
    };

}).directive('titulo', function() {
    return {
        restrict: 'E',
        template: '<h3 class="panel-title fftnr fwb">{{titulo}}</h3>'
    }

}).directive('chosen', function() {
    var linker = function(scope, element, attr, ngModel) {

        var __indexOf = [].indexOf || function(item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item)
                    return i;
            }
            return -1;
        };

        var CHOSEN_OPTION_WHITELIST, NG_OPTIONS_REGEXP, isEmpty, snakeCase;

        NG_OPTIONS_REGEXP = /^\s*(.*?)(?:\s+as\s+(.*?))?(?:\s+group\s+by\s+(.*))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+(.*?)(?:\s+track\s+by\s+(.*?))?$/;
        CHOSEN_OPTION_WHITELIST = ['noResultsText', 'allowSingleDeselect', 'disableSearchThreshold', 'disableSearch', 'enableSplitWordSearch', 'inheritSelectClasses', 'maxSelectedOptions', 'placeholderTextMultiple', 'placeholderTextSingle', 'searchContains', 'singleBackstrokeDelete', 'displayDisabledOptions', 'displaySelectedOptions', 'width'];
        snakeCase = function(input) {
            return input.replace(/[A-Z]/g, function($1) {
                return "_" + ($1.toLowerCase());
            });
        };

        isEmpty = function(value) {
            var key;

            if (angular.isArray(value)) {
                return value.length === 0;
            } else if (angular.isObject(value)) {
                for (key in value) {
                    if (value.hasOwnProperty(key)) {
                        return false;
                    }
                }
            }
            return true;
        };

        var chosen, defaultText, disableWithMessage, empty, initOrUpdate, match, options, origRender, removeEmptyMessage, startLoading, stopLoading, valuesExpr, viewWatch;

        element.addClass('localytics-chosen');
        options = scope.$eval(attr.chosen) || {};
        angular.forEach(attr, function(value, key) {
            if (__indexOf.call(CHOSEN_OPTION_WHITELIST, key) >= 0) {
                return options[snakeCase(key)] = scope.$eval(value);
            }
        });

        // update the select when data is loaded
        scope.$watch(attr.chosen, function() {
            element.trigger('chosen:updated');
        });

        // update the select when the model changes
        scope.$watch(attr.ngModel, function() {
            element.trigger('chosen:updated');
        });

        attr.$observe('disabled', function() {
            element.trigger('chosen:updated');

        });


        chosen = null;
        defaultText = null;
        empty = false;
        initOrUpdate = function() {
            if (chosen) {
                return element.trigger('chosen:updated');
            } else {
                chosen = element.chosen(options).data('chosen');
                return defaultText = chosen.default_text;
            }
        };

        removeEmptyMessage = function() {
            empty = false;
            return element.attr('data-placeholder', defaultText);
        };
        disableWithMessage = function() {
            empty = true;
            return element.attr('data-placeholder', chosen.results_none_found).attr('disabled', true).trigger('chosen:updated');
        };
        if (ngModel) {
            origRender = ngModel.$render;
            ngModel.$render = function() {
                origRender();
                return initOrUpdate();
            };
            if (attr.multiple) {
                viewWatch = function() {
                    return ngModel.$viewValue;
                };
                scope.$watch(viewWatch, ngModel.$render, true);
            }
        } else {
            initOrUpdate();
        }

        startLoading = function() {
            return element.addClass('loading').attr('disabled', true).trigger('chosen:updated');
        };

        stopLoading = function() {
            return element.removeClass('loading').attr('disabled', false).trigger('chosen:updated');
        };


        if (attr.ngOptions && ngModel) {
            match = attr.ngOptions.match(NG_OPTIONS_REGEXP);
            valuesExpr = match[7];
            return scope.$watchCollection(valuesExpr, function(newVal, oldVal) {
                if (angular.isUndefined(newVal)) {
                    return startLoading();
                } else {
                    if (empty) {
                        removeEmptyMessage();
                    }
                    stopLoading();
                    if (isEmpty(newVal)) {
                        return disableWithMessage();
                    }
                }
            });
        }


        element.chosen();
    };

    return {
        restrict: 'A',
        require: '?ngModel',
        link: linker
    };
});
