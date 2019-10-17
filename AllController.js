"use strict";

angular.module("myApp").controller('HomeController', function ($scope, $http, $rootScope, $location) {

    $scope.clientCode = "";
    $scope.apiKey = "";
    $scope.salt = "";
    $scope.stan = new Date().getTime();
    $scope.requestId = new Date().getTime();
    $scope.redirectUrl = " https://sandbox..veri5digital.com/dummy-app/#/fetch";
    $scope.purpose = "OnBoarding";
    $scope.email = "";
    $scope.mobile = "";
    $scope.otpRequired = "N";

    $scope.hash = Sha256.hash($scope.clientCode + "|" + $scope.requestId + "|" + $scope.apiKey + "|" + $scope.salt);
    ;
    $scope.calculateHash = function () {
        $scope.hash = Sha256.hash($scope.clientCode + "|" + $scope.requestId + "|" + $scope.apiKey + "|" + $scope.salt);
    }


    $scope.message = "Welcome to Veri5digital Msite Demo";
    $scope.errorCode = $location.search().errCode;


})

angular.module("myApp").controller('FetchController', function ($scope, $http, $rootScope, $location) {
    $scope.init = function () {

        $scope.userId = $location.search().userId;
        $scope.calculateHash = function () {

            $scope.hash = Sha256.hash($scope.clientCode + "|" + $scope.userId + "|" + $scope.apiKey + "|" + $scope.salt);
        }


        $scope.fetchKYC = function () {
            $scope.IsVisible = false;
            $scope.clientCode = "";
            $scope.apiKey = "";
            $scope.salt = "";
            $scope.calculateHash();

            var request = {

                "headers": {
                    "client_code": $scope.clientCode,
                    "sub_client_code": '',
                    "channel_code": 'WEB_APP',
                    "channel_version": '0.0.1',
                    "stan": (new Date().getTime().toString() + Math.random()).toString(),
                    "client_ip": 'NA',
                    "transmission_datetime": Date.now().toString(),
                    "operation_mode": 'SELF',
                    "run_mode": 'TRIAL',
                    "actor_type": 'CLIENT',
                    "user_handle_type": '',
                    "user_handle_value": '',
                    "location": 'NA',
                    "function_code": 'REVISED',
                    "function_sub_code": 'DEFAULT'
                },
                "request": {
                    "user_id": $scope.userId,
                    "hash": $scope.hash,
                    "api_key": $scope.apiKey,

                }
            }

            $http({
                method: "POST",
                url: "https://sandbox.veri5digital.com/video-id-kyc/api/v1/fetchKYCInfo",
                data: request
            })
                .success(svcSuccessHandler)

                .error(svcErrorHandler);
        }

        var svcSuccessHandler = function (data, status, headers, config) {

            console.log('check', data.response_status.status);
            if (data.response_status.status === "SUCCESS") {
                $scope.IsVisible = true;

            }


            var kycData = JSON.parse(atob(data["response_data"]["kyc_info"]));

            $scope.kycInfo = atob(data["response_data"]["kyc_info"]);
            $scope.docImage = kycData.photo.document_image;
            $scope.matchRate = kycData.photo.match_rate;
            $scope.liveImage = kycData.photo.live_image;
            $scope.matchStatus = kycData.photo.match_status;
            $scope.name = kycData.original_kyc_info.name;
            $scope.verifiedBy = kycData.original_kyc_info.verified_by;
            $scope.address = kycData.original_kyc_info.address;
            $scope.gender = kycData.original_kyc_info.gender;
            $scope.mobileNo = kycData.original_kyc_info.mobile;
            $scope.dob = kycData.original_kyc_info.dob;
            $scope.docType = kycData.original_kyc_info.doc_type;
            $scope.documentId = kycData.original_kyc_info.document_id;
            $scope.verifiedUsing = kycData.original_kyc_info.verified_using;
            $scope.declaredName = kycData.declared_kyc_info.name;
            $scope.declaredFathersName = kycData.declared_kyc_info.father_name;
            $scope.declaredAddress = kycData.declared_kyc_info.address;
            $scope.declaredGender = kycData.declared_kyc_info.gender;
            $scope.declaredDob = kycData.declared_kyc_info.dob;
            $scope.declaredDocType = kycData.declared_kyc_info.doc_type;
            $scope.declaredDocumentId = kycData.declared_kyc_info.document_id;

        }

        var svcErrorHandler = function (data, status, headers, config) {

        }
    }
})

