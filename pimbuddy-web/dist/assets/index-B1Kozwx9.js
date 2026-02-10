var Ps=Object.defineProperty;var _s=(o,e,t)=>e in o?Ps(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var ea=(o,e,t)=>_s(o,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();/*! @azure/msal-common v14.16.1 2025-08-05 */const f={LIBRARY_NAME:"MSAL.JS",SKU:"msal.js.common",CACHE_PREFIX:"msal",DEFAULT_AUTHORITY:"https://login.microsoftonline.com/common/",DEFAULT_AUTHORITY_HOST:"login.microsoftonline.com",DEFAULT_COMMON_TENANT:"common",ADFS:"adfs",DSTS:"dstsv2",AAD_INSTANCE_DISCOVERY_ENDPT:"https://login.microsoftonline.com/common/discovery/instance?api-version=1.1&authorization_endpoint=",CIAM_AUTH_URL:".ciamlogin.com",AAD_TENANT_DOMAIN_SUFFIX:".onmicrosoft.com",RESOURCE_DELIM:"|",NO_ACCOUNT:"NO_ACCOUNT",CLAIMS:"claims",CONSUMER_UTID:"9188040d-6c67-4c5b-b112-36a304b66dad",OPENID_SCOPE:"openid",PROFILE_SCOPE:"profile",OFFLINE_ACCESS_SCOPE:"offline_access",EMAIL_SCOPE:"email",CODE_RESPONSE_TYPE:"code",CODE_GRANT_TYPE:"authorization_code",RT_GRANT_TYPE:"refresh_token",FRAGMENT_RESPONSE_MODE:"fragment",S256_CODE_CHALLENGE_METHOD:"S256",URL_FORM_CONTENT_TYPE:"application/x-www-form-urlencoded;charset=utf-8",AUTHORIZATION_PENDING:"authorization_pending",NOT_DEFINED:"not_defined",EMPTY_STRING:"",NOT_APPLICABLE:"N/A",NOT_AVAILABLE:"Not Available",FORWARD_SLASH:"/",IMDS_ENDPOINT:"http://169.254.169.254/metadata/instance/compute/location",IMDS_VERSION:"2020-06-01",IMDS_TIMEOUT:2e3,AZURE_REGION_AUTO_DISCOVER_FLAG:"TryAutoDetect",REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX:"login.microsoft.com",KNOWN_PUBLIC_CLOUDS:["login.microsoftonline.com","login.windows.net","login.microsoft.com","sts.windows.net"],TOKEN_RESPONSE_TYPE:"token",ID_TOKEN_RESPONSE_TYPE:"id_token",SHR_NONCE_VALIDITY:240,INVALID_INSTANCE:"invalid_instance"},rt={CLIENT_ERROR_RANGE_START:400,CLIENT_ERROR_RANGE_END:499,SERVER_ERROR_RANGE_START:500,SERVER_ERROR_RANGE_END:599},Ge=[f.OPENID_SCOPE,f.PROFILE_SCOPE,f.OFFLINE_ACCESS_SCOPE],ta=[...Ge,f.EMAIL_SCOPE],j={CONTENT_TYPE:"Content-Type",CONTENT_LENGTH:"Content-Length",RETRY_AFTER:"Retry-After",CCS_HEADER:"X-AnchorMailbox",WWWAuthenticate:"WWW-Authenticate",AuthenticationInfo:"Authentication-Info",X_MS_REQUEST_ID:"x-ms-request-id",X_MS_HTTP_VERSION:"x-ms-httpver"},q={ID_TOKEN:"idtoken",CLIENT_INFO:"client.info",ADAL_ID_TOKEN:"adal.idtoken",ERROR:"error",ERROR_DESC:"error.description",ACTIVE_ACCOUNT:"active-account",ACTIVE_ACCOUNT_FILTERS:"active-account-filters"},be={COMMON:"common",ORGANIZATIONS:"organizations",CONSUMERS:"consumers"},st={ACCESS_TOKEN:"access_token",XMS_CC:"xms_cc"},F={LOGIN:"login",SELECT_ACCOUNT:"select_account",CONSENT:"consent",NONE:"none",CREATE:"create",NO_SESSION:"no_session"},ia={PLAIN:"plain",S256:"S256"},tt={QUERY:"query",FRAGMENT:"fragment"},Ms={...tt},Ha={AUTHORIZATION_CODE_GRANT:"authorization_code",REFRESH_TOKEN_GRANT:"refresh_token"},nt={MSSTS_ACCOUNT_TYPE:"MSSTS",ADFS_ACCOUNT_TYPE:"ADFS",GENERIC_ACCOUNT_TYPE:"Generic"},K={CACHE_KEY_SEPARATOR:"-",CLIENT_INFO_SEPARATOR:"."},S={ID_TOKEN:"IdToken",ACCESS_TOKEN:"AccessToken",ACCESS_TOKEN_WITH_AUTH_SCHEME:"AccessToken_With_AuthScheme",REFRESH_TOKEN:"RefreshToken"},li="appmetadata",Ns="client_info",We="1",gt={CACHE_KEY:"authority-metadata",REFRESH_TIME_SECONDS:3600*24},W={CONFIG:"config",CACHE:"cache",NETWORK:"network",HARDCODED_VALUES:"hardcoded_values"},B={SCHEMA_VERSION:5,MAX_LAST_HEADER_BYTES:330,MAX_CACHED_ERRORS:50,CACHE_KEY:"server-telemetry",CATEGORY_SEPARATOR:"|",VALUE_SEPARATOR:",",OVERFLOW_TRUE:"1",OVERFLOW_FALSE:"0",UNKNOWN_ERROR:"unknown_error"},M={BEARER:"Bearer",POP:"pop",SSH:"ssh-cert"},Je={DEFAULT_THROTTLE_TIME_SECONDS:60,DEFAULT_MAX_THROTTLE_TIME_SECONDS:3600,THROTTLING_PREFIX:"throttling",X_MS_LIB_CAPABILITY_VALUE:"retry-after, h429"},aa={INVALID_GRANT_ERROR:"invalid_grant",CLIENT_MISMATCH_ERROR:"client_mismatch"},ra={username:"username",password:"password"},ot={httpSuccess:200,httpBadRequest:400},Pe={FAILED_AUTO_DETECTION:"1",INTERNAL_CACHE:"2",ENVIRONMENT_VARIABLE:"3",IMDS:"4"},Ht={CONFIGURED_NO_AUTO_DETECTION:"2",AUTO_DETECTION_REQUESTED_SUCCESSFUL:"4",AUTO_DETECTION_REQUESTED_FAILED:"5"},ye={NOT_APPLICABLE:"0",FORCE_REFRESH_OR_CLAIMS:"1",NO_CACHED_ACCESS_TOKEN:"2",CACHED_ACCESS_TOKEN_EXPIRED:"3",PROACTIVELY_REFRESHED:"4"},Os={Pop:"pop"},$s=300;/*! @azure/msal-common v14.16.1 2025-08-05 */const di="unexpected_error",Ds="post_request_failed";/*! @azure/msal-common v14.16.1 2025-08-05 */const sa={[di]:"Unexpected error in authentication.",[Ds]:"Post request failed from the network, could be a 4xx/5xx or a network unavailability. Please check the exact error code for details."};class D extends Error{constructor(e,t,i){const a=t?`${e}: ${t}`:e;super(a),Object.setPrototypeOf(this,D.prototype),this.errorCode=e||f.EMPTY_STRING,this.errorMessage=t||f.EMPTY_STRING,this.subError=i||f.EMPTY_STRING,this.name="AuthError"}setCorrelationId(e){this.correlationId=e}}function Ua(o,e){return new D(o,e?`${sa[o]} ${e}`:sa[o])}/*! @azure/msal-common v14.16.1 2025-08-05 */const ui="client_info_decoding_error",za="client_info_empty_error",hi="token_parsing_error",qa="null_or_empty_token",ge="endpoints_resolution_error",Fa="network_error",Ba="openid_config_error",Ga="hash_not_deserialized",ze="invalid_state",Ka="state_mismatch",mt="state_not_found",ja="nonce_mismatch",pi="auth_time_not_found",Va="max_age_transpired",Ls="multiple_matching_tokens",Hs="multiple_matching_accounts",Ya="multiple_matching_appMetadata",Wa="request_cannot_be_made",Ja="cannot_remove_empty_scope",Qa="cannot_append_scopeset",jt="empty_input_scopeset",Us="device_code_polling_cancelled",zs="device_code_expired",qs="device_code_unknown_error",gi="no_account_in_silent_request",Xa="invalid_cache_record",mi="invalid_cache_environment",Vt="no_account_found",Yt="no_crypto_object",Wt="unexpected_credential_type",Fs="invalid_assertion",Bs="invalid_client_credential",me="token_refresh_required",Gs="user_timeout_reached",Za="token_claims_cnf_required_for_signedjwt",er="authorization_code_missing_from_server_response",Ks="binding_key_not_removed",tr="end_session_endpoint_not_supported",fi="key_id_missing",js="no_network_connectivity",Vs="user_canceled",Ys="missing_tenant_id_error",R="method_not_implemented",Ws="nested_app_auth_bridge_disabled";/*! @azure/msal-common v14.16.1 2025-08-05 */const na={[ui]:"The client info could not be parsed/decoded correctly",[za]:"The client info was empty",[hi]:"Token cannot be parsed",[qa]:"The token is null or empty",[ge]:"Endpoints cannot be resolved",[Fa]:"Network request failed",[Ba]:"Could not retrieve endpoints. Check your authority and verify the .well-known/openid-configuration endpoint returns the required endpoints.",[Ga]:"The hash parameters could not be deserialized",[ze]:"State was not the expected format",[Ka]:"State mismatch error",[mt]:"State not found",[ja]:"Nonce mismatch error",[pi]:"Max Age was requested and the ID token is missing the auth_time variable. auth_time is an optional claim and is not enabled by default - it must be enabled. See https://aka.ms/msaljs/optional-claims for more information.",[Va]:"Max Age is set to 0, or too much time has elapsed since the last end-user authentication.",[Ls]:"The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more requirements such as authority or account.",[Hs]:"The cache contains multiple accounts satisfying the given parameters. Please pass more info to obtain the correct account",[Ya]:"The cache contains multiple appMetadata satisfying the given parameters. Please pass more info to obtain the correct appMetadata",[Wa]:"Token request cannot be made without authorization code or refresh token.",[Ja]:"Cannot remove null or empty scope from ScopeSet",[Qa]:"Cannot append ScopeSet",[jt]:"Empty input ScopeSet cannot be processed",[Us]:"Caller has cancelled token endpoint polling during device code flow by setting DeviceCodeRequest.cancel = true.",[zs]:"Device code is expired.",[qs]:"Device code stopped polling for unknown reasons.",[gi]:"Please pass an account object, silent flow is not supported without account information",[Xa]:"Cache record object was null or undefined.",[mi]:"Invalid environment when attempting to create cache entry",[Vt]:"No account found in cache for given key.",[Yt]:"No crypto object detected.",[Wt]:"Unexpected credential type.",[Fs]:"Client assertion must meet requirements described in https://tools.ietf.org/html/rfc7515",[Bs]:"Client credential (secret, certificate, or assertion) must not be empty when creating a confidential client. An application should at most have one credential",[me]:"Cannot return token from cache because it must be refreshed. This may be due to one of the following reasons: forceRefresh parameter is set to true, claims have been requested, there is no cached access token or it is expired.",[Gs]:"User defined timeout for device code polling reached",[Za]:"Cannot generate a POP jwt if the token_claims are not populated",[er]:"Server response does not contain an authorization code to proceed",[Ks]:"Could not remove the credential's binding key from storage.",[tr]:"The provided authority does not support logout",[fi]:"A keyId value is missing from the requested bound token's cache record and is required to match the token to it's stored binding key.",[js]:"No network connectivity. Check your internet connection.",[Vs]:"User cancelled the flow.",[Ys]:"A tenant id - not common, organizations, or consumers - must be specified when using the client_credentials flow.",[R]:"This method has not been implemented",[Ws]:"The nested app auth bridge is disabled"};class kt extends D{constructor(e,t){super(e,t?`${na[e]}: ${t}`:na[e]),this.name="ClientAuthError",Object.setPrototypeOf(this,kt.prototype)}}function y(o,e){return new kt(o,e)}/*! @azure/msal-common v14.16.1 2025-08-05 */const ft={createNewGuid:()=>{throw y(R)},base64Decode:()=>{throw y(R)},base64Encode:()=>{throw y(R)},base64UrlEncode:()=>{throw y(R)},encodeKid:()=>{throw y(R)},async getPublicKeyThumbprint(){throw y(R)},async removeTokenBindingKey(){throw y(R)},async clearKeystore(){throw y(R)},async signJwt(){throw y(R)},async hashString(){throw y(R)}};/*! @azure/msal-common v14.16.1 2025-08-05 */var L;(function(o){o[o.Error=0]="Error",o[o.Warning=1]="Warning",o[o.Info=2]="Info",o[o.Verbose=3]="Verbose",o[o.Trace=4]="Trace"})(L||(L={}));class Ce{constructor(e,t,i){this.level=L.Info;const a=()=>{},r=e||Ce.createDefaultLoggerOptions();this.localCallback=r.loggerCallback||a,this.piiLoggingEnabled=r.piiLoggingEnabled||!1,this.level=typeof r.logLevel=="number"?r.logLevel:L.Info,this.correlationId=r.correlationId||f.EMPTY_STRING,this.packageName=t||f.EMPTY_STRING,this.packageVersion=i||f.EMPTY_STRING}static createDefaultLoggerOptions(){return{loggerCallback:()=>{},piiLoggingEnabled:!1,logLevel:L.Info}}clone(e,t,i){return new Ce({loggerCallback:this.localCallback,piiLoggingEnabled:this.piiLoggingEnabled,logLevel:this.level,correlationId:i||this.correlationId},e,t)}logMessage(e,t){if(t.logLevel>this.level||!this.piiLoggingEnabled&&t.containsPii)return;const r=`${`[${new Date().toUTCString()}] : [${t.correlationId||this.correlationId||""}]`} : ${this.packageName}@${this.packageVersion} : ${L[t.logLevel]} - ${e}`;this.executeCallback(t.logLevel,r,t.containsPii||!1)}executeCallback(e,t,i){this.localCallback&&this.localCallback(e,t,i)}error(e,t){this.logMessage(e,{logLevel:L.Error,containsPii:!1,correlationId:t||f.EMPTY_STRING})}errorPii(e,t){this.logMessage(e,{logLevel:L.Error,containsPii:!0,correlationId:t||f.EMPTY_STRING})}warning(e,t){this.logMessage(e,{logLevel:L.Warning,containsPii:!1,correlationId:t||f.EMPTY_STRING})}warningPii(e,t){this.logMessage(e,{logLevel:L.Warning,containsPii:!0,correlationId:t||f.EMPTY_STRING})}info(e,t){this.logMessage(e,{logLevel:L.Info,containsPii:!1,correlationId:t||f.EMPTY_STRING})}infoPii(e,t){this.logMessage(e,{logLevel:L.Info,containsPii:!0,correlationId:t||f.EMPTY_STRING})}verbose(e,t){this.logMessage(e,{logLevel:L.Verbose,containsPii:!1,correlationId:t||f.EMPTY_STRING})}verbosePii(e,t){this.logMessage(e,{logLevel:L.Verbose,containsPii:!0,correlationId:t||f.EMPTY_STRING})}trace(e,t){this.logMessage(e,{logLevel:L.Trace,containsPii:!1,correlationId:t||f.EMPTY_STRING})}tracePii(e,t){this.logMessage(e,{logLevel:L.Trace,containsPii:!0,correlationId:t||f.EMPTY_STRING})}isPiiLoggingEnabled(){return this.piiLoggingEnabled||!1}}/*! @azure/msal-common v14.16.1 2025-08-05 */const ir="@azure/msal-common",vi="14.16.1";/*! @azure/msal-common v14.16.1 2025-08-05 */const yi={None:"none"};/*! @azure/msal-common v14.16.1 2025-08-05 */function Se(o,e){const t=Js(o);try{const i=e(t);return JSON.parse(i)}catch{throw y(hi)}}function Js(o){if(!o)throw y(qa);const t=/^([^\.\s]*)\.([^\.\s]+)\.([^\.\s]*)$/.exec(o);if(!t||t.length<4)throw y(hi);return t[2]}function ar(o,e){if(e===0||Date.now()-3e5>o+e)throw y(Va)}/*! @azure/msal-common v14.16.1 2025-08-05 */function de(){return Math.round(new Date().getTime()/1e3)}function Jt(o,e){const t=Number(o)||0;return de()+e>t}function Qs(o){return Number(o)>de()}/*! @azure/msal-common v14.16.1 2025-08-05 */function Oe(o){return[Xs(o),Zs(o),en(o),tn(o),an(o)].join(K.CACHE_KEY_SEPARATOR).toLowerCase()}function Et(o,e,t,i,a){return{credentialType:S.ID_TOKEN,homeAccountId:o,environment:e,clientId:i,secret:t,realm:a}}function St(o,e,t,i,a,r,s,n,c,l,d,u,p,h,m){var w,C;const v={homeAccountId:o,credentialType:S.ACCESS_TOKEN,secret:t,cachedAt:de().toString(),expiresOn:s.toString(),extendedExpiresOn:n.toString(),environment:e,clientId:i,realm:a,target:r,tokenType:d||M.BEARER};if(u&&(v.userAssertionHash=u),l&&(v.refreshOn=l.toString()),h&&(v.requestedClaims=h,v.requestedClaimsHash=m),((w=v.tokenType)==null?void 0:w.toLowerCase())!==M.BEARER.toLowerCase())switch(v.credentialType=S.ACCESS_TOKEN_WITH_AUTH_SCHEME,v.tokenType){case M.POP:const T=Se(t,c);if(!((C=T==null?void 0:T.cnf)!=null&&C.kid))throw y(Za);v.keyId=T.cnf.kid;break;case M.SSH:v.keyId=p}return v}function rr(o,e,t,i,a,r,s){const n={credentialType:S.REFRESH_TOKEN,homeAccountId:o,environment:e,clientId:i,secret:t};return r&&(n.userAssertionHash=r),a&&(n.familyId=a),s&&(n.expiresOn=s.toString()),n}function bi(o){return o.hasOwnProperty("homeAccountId")&&o.hasOwnProperty("environment")&&o.hasOwnProperty("credentialType")&&o.hasOwnProperty("clientId")&&o.hasOwnProperty("secret")}function oa(o){return o?bi(o)&&o.hasOwnProperty("realm")&&o.hasOwnProperty("target")&&(o.credentialType===S.ACCESS_TOKEN||o.credentialType===S.ACCESS_TOKEN_WITH_AUTH_SCHEME):!1}function ca(o){return o?bi(o)&&o.hasOwnProperty("realm")&&o.credentialType===S.ID_TOKEN:!1}function la(o){return o?bi(o)&&o.credentialType===S.REFRESH_TOKEN:!1}function Xs(o){return[o.homeAccountId,o.environment].join(K.CACHE_KEY_SEPARATOR).toLowerCase()}function Zs(o){const e=o.credentialType===S.REFRESH_TOKEN&&o.familyId||o.clientId;return[o.credentialType,e,o.realm||""].join(K.CACHE_KEY_SEPARATOR).toLowerCase()}function en(o){return(o.target||"").toLowerCase()}function tn(o){return(o.requestedClaimsHash||"").toLowerCase()}function an(o){return o.tokenType&&o.tokenType.toLowerCase()!==M.BEARER.toLowerCase()?o.tokenType.toLowerCase():""}function rn(o,e){const t=o.indexOf(B.CACHE_KEY)===0;let i=!0;return e&&(i=e.hasOwnProperty("failedRequests")&&e.hasOwnProperty("errors")&&e.hasOwnProperty("cacheHits")),t&&i}function sn(o,e){let t=!1;o&&(t=o.indexOf(Je.THROTTLING_PREFIX)===0);let i=!0;return e&&(i=e.hasOwnProperty("throttleTime")),t&&i}function nn({environment:o,clientId:e}){return[li,o,e].join(K.CACHE_KEY_SEPARATOR).toLowerCase()}function on(o,e){return e?o.indexOf(li)===0&&e.hasOwnProperty("clientId")&&e.hasOwnProperty("environment"):!1}function cn(o,e){return e?o.indexOf(gt.CACHE_KEY)===0&&e.hasOwnProperty("aliases")&&e.hasOwnProperty("preferred_cache")&&e.hasOwnProperty("preferred_network")&&e.hasOwnProperty("canonical_authority")&&e.hasOwnProperty("authorization_endpoint")&&e.hasOwnProperty("token_endpoint")&&e.hasOwnProperty("issuer")&&e.hasOwnProperty("aliasesFromNetwork")&&e.hasOwnProperty("endpointsFromNetwork")&&e.hasOwnProperty("expiresAt")&&e.hasOwnProperty("jwks_uri"):!1}function da(){return de()+gt.REFRESH_TIME_SECONDS}function ct(o,e,t){o.authorization_endpoint=e.authorization_endpoint,o.token_endpoint=e.token_endpoint,o.end_session_endpoint=e.end_session_endpoint,o.issuer=e.issuer,o.endpointsFromNetwork=t,o.jwks_uri=e.jwks_uri}function Ut(o,e,t){o.aliases=e.aliases,o.preferred_cache=e.preferred_cache,o.preferred_network=e.preferred_network,o.aliasesFromNetwork=t}function ua(o){return o.expiresAt<=de()}/*! @azure/msal-common v14.16.1 2025-08-05 */const sr="redirect_uri_empty",ln="claims_request_parsing_error",nr="authority_uri_insecure",Ye="url_parse_error",or="empty_url_error",cr="empty_input_scopes_error",lr="invalid_prompt_value",Ci="invalid_claims",dr="token_request_empty",ur="logout_request_empty",hr="invalid_code_challenge_method",wi="pkce_params_missing",Ai="invalid_cloud_discovery_metadata",pr="invalid_authority_metadata",gr="untrusted_authority",Rt="missing_ssh_jwk",mr="missing_ssh_kid",dn="missing_nonce_authentication_header",un="invalid_authentication_header",fr="cannot_set_OIDCOptions",vr="cannot_allow_native_broker",yr="authority_mismatch";/*! @azure/msal-common v14.16.1 2025-08-05 */const hn={[sr]:"A redirect URI is required for all calls, and none has been set.",[ln]:"Could not parse the given claims request object.",[nr]:"Authority URIs must use https.  Please see here for valid authority configuration options: https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options",[Ye]:"URL could not be parsed into appropriate segments.",[or]:"URL was empty or null.",[cr]:"Scopes cannot be passed as null, undefined or empty array because they are required to obtain an access token.",[lr]:"Please see here for valid configuration options: https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#commonauthorizationurlrequest",[Ci]:"Given claims parameter must be a stringified JSON object.",[dr]:"Token request was empty and not found in cache.",[ur]:"The logout request was null or undefined.",[hr]:'code_challenge_method passed is invalid. Valid values are "plain" and "S256".',[wi]:"Both params: code_challenge and code_challenge_method are to be passed if to be sent in the request",[Ai]:"Invalid cloudDiscoveryMetadata provided. Must be a stringified JSON object containing tenant_discovery_endpoint and metadata fields",[pr]:"Invalid authorityMetadata provided. Must by a stringified JSON object containing authorization_endpoint, token_endpoint, issuer fields.",[gr]:"The provided authority is not a trusted authority. Please include this authority in the knownAuthorities config parameter.",[Rt]:"Missing sshJwk in SSH certificate request. A stringified JSON Web Key is required when using the SSH authentication scheme.",[mr]:"Missing sshKid in SSH certificate request. A string that uniquely identifies the public SSH key is required when using the SSH authentication scheme.",[dn]:"Unable to find an authentication header containing server nonce. Either the Authentication-Info or WWW-Authenticate headers must be present in order to obtain a server nonce.",[un]:"Invalid authentication header provided",[fr]:"Cannot set OIDCOptions parameter. Please change the protocol mode to OIDC or use a non-Microsoft authority.",[vr]:"Cannot set allowNativeBroker parameter to true when not in AAD protocol mode.",[yr]:"Authority mismatch error. Authority provided in login request or PublicClientApplication config does not match the environment of the provided account. Please use a matching account or make an interactive request to login to this authority."};class Ti extends D{constructor(e){super(e,hn[e]),this.name="ClientConfigurationError",Object.setPrototypeOf(this,Ti.prototype)}}function O(o){return new Ti(o)}/*! @azure/msal-common v14.16.1 2025-08-05 */class ie{static isEmptyObj(e){if(e)try{const t=JSON.parse(e);return Object.keys(t).length===0}catch{}return!0}static startsWith(e,t){return e.indexOf(t)===0}static endsWith(e,t){return e.length>=t.length&&e.lastIndexOf(t)===e.length-t.length}static queryStringToObject(e){const t={},i=e.split("&"),a=r=>decodeURIComponent(r.replace(/\+/g," "));return i.forEach(r=>{if(r.trim()){const[s,n]=r.split(/=(.+)/g,2);s&&n&&(t[a(s)]=a(n))}}),t}static trimArrayEntries(e){return e.map(t=>t.trim())}static removeEmptyStringsFromArray(e){return e.filter(t=>!!t)}static jsonParseHelper(e){try{return JSON.parse(e)}catch{return null}}static matchPattern(e,t){return new RegExp(e.replace(/\\/g,"\\\\").replace(/\*/g,"[^ ]*").replace(/\?/g,"\\?")).test(t)}}/*! @azure/msal-common v14.16.1 2025-08-05 */class U{constructor(e){const t=e?ie.trimArrayEntries([...e]):[],i=t?ie.removeEmptyStringsFromArray(t):[];this.validateInputScopes(i),this.scopes=new Set,i.forEach(a=>this.scopes.add(a))}static fromString(e){const i=(e||f.EMPTY_STRING).split(" ");return new U(i)}static createSearchScopes(e){const t=new U(e);return t.containsOnlyOIDCScopes()?t.removeScope(f.OFFLINE_ACCESS_SCOPE):t.removeOIDCScopes(),t}validateInputScopes(e){if(!e||e.length<1)throw O(cr)}containsScope(e){const t=this.printScopesLowerCase().split(" "),i=new U(t);return e?i.scopes.has(e.toLowerCase()):!1}containsScopeSet(e){return!e||e.scopes.size<=0?!1:this.scopes.size>=e.scopes.size&&e.asArray().every(t=>this.containsScope(t))}containsOnlyOIDCScopes(){let e=0;return ta.forEach(t=>{this.containsScope(t)&&(e+=1)}),this.scopes.size===e}appendScope(e){e&&this.scopes.add(e.trim())}appendScopes(e){try{e.forEach(t=>this.appendScope(t))}catch{throw y(Qa)}}removeScope(e){if(!e)throw y(Ja);this.scopes.delete(e.trim())}removeOIDCScopes(){ta.forEach(e=>{this.scopes.delete(e)})}unionScopeSets(e){if(!e)throw y(jt);const t=new Set;return e.scopes.forEach(i=>t.add(i.toLowerCase())),this.scopes.forEach(i=>t.add(i.toLowerCase())),t}intersectingScopeSets(e){if(!e)throw y(jt);e.containsOnlyOIDCScopes()||e.removeOIDCScopes();const t=this.unionScopeSets(e),i=e.getScopeCount(),a=this.getScopeCount();return t.size<a+i}getScopeCount(){return this.scopes.size}asArray(){const e=[];return this.scopes.forEach(t=>e.push(t)),e}printScopes(){return this.scopes?this.asArray().join(" "):f.EMPTY_STRING}printScopesLowerCase(){return this.printScopes().toLowerCase()}}/*! @azure/msal-common v14.16.1 2025-08-05 */function vt(o,e){if(!o)throw y(za);try{const t=e(o);return JSON.parse(t)}catch{throw y(ui)}}function $e(o){if(!o)throw y(ui);const e=o.split(K.CLIENT_INFO_SEPARATOR,2);return{uid:e[0],utid:e.length<2?f.EMPTY_STRING:e[1]}}/*! @azure/msal-common v14.16.1 2025-08-05 */function yt(o,e){return!!o&&!!e&&o===e.split(".")[1]}function Ii(o,e,t,i){if(i){const{oid:a,sub:r,tid:s,name:n,tfp:c,acr:l}=i,d=s||c||l||"";return{tenantId:d,localAccountId:a||r||"",name:n,isHomeTenant:yt(d,o)}}else return{tenantId:t,localAccountId:e,isHomeTenant:yt(t,o)}}function ki(o,e,t,i){let a=o;if(e){const{isHomeTenant:r,...s}=e;a={...o,...s}}if(t){const{isHomeTenant:r,...s}=Ii(o.homeAccountId,o.localAccountId,o.tenantId,t);return a={...a,...s,idTokenClaims:t,idToken:i},a}return a}/*! @azure/msal-common v14.16.1 2025-08-05 */const te={Default:0,Adfs:1,Dsts:2,Ciam:3};/*! @azure/msal-common v14.16.1 2025-08-05 */function br(o){return o&&(o.tid||o.tfp||o.acr)||null}/*! @azure/msal-common v14.16.1 2025-08-05 */const ve={AAD:"AAD",OIDC:"OIDC"};/*! @azure/msal-common v14.16.1 2025-08-05 */class z{generateAccountId(){return[this.homeAccountId,this.environment].join(K.CACHE_KEY_SEPARATOR).toLowerCase()}generateAccountKey(){return z.generateAccountCacheKey({homeAccountId:this.homeAccountId,environment:this.environment,tenantId:this.realm,username:this.username,localAccountId:this.localAccountId})}getAccountInfo(){return{homeAccountId:this.homeAccountId,environment:this.environment,tenantId:this.realm,username:this.username,localAccountId:this.localAccountId,name:this.name,nativeAccountId:this.nativeAccountId,authorityType:this.authorityType,tenantProfiles:new Map((this.tenantProfiles||[]).map(e=>[e.tenantId,e]))}}isSingleTenant(){return!this.tenantProfiles}static generateAccountCacheKey(e){const t=e.homeAccountId.split(".")[1];return[e.homeAccountId,e.environment||"",t||e.tenantId||""].join(K.CACHE_KEY_SEPARATOR).toLowerCase()}static createAccount(e,t,i){var l,d,u,p,h,m;const a=new z;t.authorityType===te.Adfs?a.authorityType=nt.ADFS_ACCOUNT_TYPE:t.protocolMode===ve.AAD?a.authorityType=nt.MSSTS_ACCOUNT_TYPE:a.authorityType=nt.GENERIC_ACCOUNT_TYPE;let r;e.clientInfo&&i&&(r=vt(e.clientInfo,i)),a.clientInfo=e.clientInfo,a.homeAccountId=e.homeAccountId,a.nativeAccountId=e.nativeAccountId;const s=e.environment||t&&t.getPreferredCache();if(!s)throw y(mi);a.environment=s,a.realm=(r==null?void 0:r.utid)||br(e.idTokenClaims)||"",a.localAccountId=(r==null?void 0:r.uid)||((l=e.idTokenClaims)==null?void 0:l.oid)||((d=e.idTokenClaims)==null?void 0:d.sub)||"";const n=((u=e.idTokenClaims)==null?void 0:u.preferred_username)||((p=e.idTokenClaims)==null?void 0:p.upn),c=(h=e.idTokenClaims)!=null&&h.emails?e.idTokenClaims.emails[0]:null;if(a.username=n||c||"",a.name=((m=e.idTokenClaims)==null?void 0:m.name)||"",a.cloudGraphHostName=e.cloudGraphHostName,a.msGraphHost=e.msGraphHost,e.tenantProfiles)a.tenantProfiles=e.tenantProfiles;else{const v=Ii(e.homeAccountId,a.localAccountId,a.realm,e.idTokenClaims);a.tenantProfiles=[v]}return a}static createFromAccountInfo(e,t,i){var r;const a=new z;return a.authorityType=e.authorityType||nt.GENERIC_ACCOUNT_TYPE,a.homeAccountId=e.homeAccountId,a.localAccountId=e.localAccountId,a.nativeAccountId=e.nativeAccountId,a.realm=e.tenantId,a.environment=e.environment,a.username=e.username,a.name=e.name,a.cloudGraphHostName=t,a.msGraphHost=i,a.tenantProfiles=Array.from(((r=e.tenantProfiles)==null?void 0:r.values())||[]),a}static generateHomeAccountId(e,t,i,a,r){if(!(t===te.Adfs||t===te.Dsts)){if(e)try{const s=vt(e,a.base64Decode);if(s.uid&&s.utid)return`${s.uid}.${s.utid}`}catch{}i.warning("No client info in response")}return(r==null?void 0:r.sub)||""}static isAccountEntity(e){return e?e.hasOwnProperty("homeAccountId")&&e.hasOwnProperty("environment")&&e.hasOwnProperty("realm")&&e.hasOwnProperty("localAccountId")&&e.hasOwnProperty("username")&&e.hasOwnProperty("authorityType"):!1}static accountInfoIsEqual(e,t,i){if(!e||!t)return!1;let a=!0;if(i){const r=e.idTokenClaims||{},s=t.idTokenClaims||{};a=r.iat===s.iat&&r.nonce===s.nonce}return e.homeAccountId===t.homeAccountId&&e.localAccountId===t.localAccountId&&e.username===t.username&&e.tenantId===t.tenantId&&e.environment===t.environment&&e.nativeAccountId===t.nativeAccountId&&a}}/*! @azure/msal-common v14.16.1 2025-08-05 */function Cr(o){return o.startsWith("#/")?o.substring(2):o.startsWith("#")||o.startsWith("?")?o.substring(1):o}function bt(o){if(!o||o.indexOf("=")<0)return null;try{const e=Cr(o),t=Object.fromEntries(new URLSearchParams(e));if(t.code||t.error||t.error_description||t.state)return t}catch{throw y(Ga)}return null}/*! @azure/msal-common v14.16.1 2025-08-05 */class x{get urlString(){return this._urlString}constructor(e){if(this._urlString=e,!this._urlString)throw O(or);e.includes("#")||(this._urlString=x.canonicalizeUri(e))}static canonicalizeUri(e){if(e){let t=e.toLowerCase();return ie.endsWith(t,"?")?t=t.slice(0,-1):ie.endsWith(t,"?/")&&(t=t.slice(0,-2)),ie.endsWith(t,"/")||(t+="/"),t}return e}validateAsUri(){let e;try{e=this.getUrlComponents()}catch{throw O(Ye)}if(!e.HostNameAndPort||!e.PathSegments)throw O(Ye);if(!e.Protocol||e.Protocol.toLowerCase()!=="https:")throw O(nr)}static appendQueryString(e,t){return t?e.indexOf("?")<0?`${e}?${t}`:`${e}&${t}`:e}static removeHashFromUrl(e){return x.canonicalizeUri(e.split("#")[0])}replaceTenantPath(e){const t=this.getUrlComponents(),i=t.PathSegments;return e&&i.length!==0&&(i[0]===be.COMMON||i[0]===be.ORGANIZATIONS)&&(i[0]=e),x.constructAuthorityUriFromObject(t)}getUrlComponents(){const e=RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?"),t=this.urlString.match(e);if(!t)throw O(Ye);const i={Protocol:t[1],HostNameAndPort:t[4],AbsolutePath:t[5],QueryString:t[7]};let a=i.AbsolutePath.split("/");return a=a.filter(r=>r&&r.length>0),i.PathSegments=a,i.QueryString&&i.QueryString.endsWith("/")&&(i.QueryString=i.QueryString.substring(0,i.QueryString.length-1)),i}static getDomainFromUrl(e){const t=RegExp("^([^:/?#]+://)?([^/?#]*)"),i=e.match(t);if(!i)throw O(Ye);return i[2]}static getAbsoluteUrl(e,t){if(e[0]===f.FORWARD_SLASH){const a=new x(t).getUrlComponents();return a.Protocol+"//"+a.HostNameAndPort+e}return e}static constructAuthorityUriFromObject(e){return new x(e.Protocol+"//"+e.HostNameAndPort+"/"+e.PathSegments.join("/"))}static hashContainsKnownProperties(e){return!!bt(e)}}/*! @azure/msal-common v14.16.1 2025-08-05 */const wr={endpointMetadata:{"login.microsoftonline.com":{token_endpoint:"https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/token",jwks_uri:"https://login.microsoftonline.com/{tenantid}/discovery/v2.0/keys",issuer:"https://login.microsoftonline.com/{tenantid}/v2.0",authorization_endpoint:"https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/authorize",end_session_endpoint:"https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/logout"},"login.chinacloudapi.cn":{token_endpoint:"https://login.chinacloudapi.cn/{tenantid}/oauth2/v2.0/token",jwks_uri:"https://login.chinacloudapi.cn/{tenantid}/discovery/v2.0/keys",issuer:"https://login.partner.microsoftonline.cn/{tenantid}/v2.0",authorization_endpoint:"https://login.chinacloudapi.cn/{tenantid}/oauth2/v2.0/authorize",end_session_endpoint:"https://login.chinacloudapi.cn/{tenantid}/oauth2/v2.0/logout"},"login.microsoftonline.us":{token_endpoint:"https://login.microsoftonline.us/{tenantid}/oauth2/v2.0/token",jwks_uri:"https://login.microsoftonline.us/{tenantid}/discovery/v2.0/keys",issuer:"https://login.microsoftonline.us/{tenantid}/v2.0",authorization_endpoint:"https://login.microsoftonline.us/{tenantid}/oauth2/v2.0/authorize",end_session_endpoint:"https://login.microsoftonline.us/{tenantid}/oauth2/v2.0/logout"}},instanceDiscoveryMetadata:{metadata:[{preferred_network:"login.microsoftonline.com",preferred_cache:"login.windows.net",aliases:["login.microsoftonline.com","login.windows.net","login.microsoft.com","sts.windows.net"]},{preferred_network:"login.partner.microsoftonline.cn",preferred_cache:"login.partner.microsoftonline.cn",aliases:["login.partner.microsoftonline.cn","login.chinacloudapi.cn"]},{preferred_network:"login.microsoftonline.de",preferred_cache:"login.microsoftonline.de",aliases:["login.microsoftonline.de"]},{preferred_network:"login.microsoftonline.us",preferred_cache:"login.microsoftonline.us",aliases:["login.microsoftonline.us","login.usgovcloudapi.net"]},{preferred_network:"login-us.microsoftonline.com",preferred_cache:"login-us.microsoftonline.com",aliases:["login-us.microsoftonline.com"]}]}},ha=wr.endpointMetadata,Ei=wr.instanceDiscoveryMetadata,Ar=new Set;Ei.metadata.forEach(o=>{o.aliases.forEach(e=>{Ar.add(e)})});function pn(o,e){var a;let t;const i=o.canonicalAuthority;if(i){const r=new x(i).getUrlComponents().HostNameAndPort;t=pa(r,(a=o.cloudDiscoveryMetadata)==null?void 0:a.metadata,W.CONFIG,e)||pa(r,Ei.metadata,W.HARDCODED_VALUES,e)||o.knownAuthorities}return t||[]}function pa(o,e,t,i){if(i==null||i.trace(`getAliasesFromMetadata called with source: ${t}`),o&&e){const a=Ct(e,o);if(a)return i==null||i.trace(`getAliasesFromMetadata: found cloud discovery metadata in ${t}, returning aliases`),a.aliases;i==null||i.trace(`getAliasesFromMetadata: did not find cloud discovery metadata in ${t}`)}return null}function gn(o){return Ct(Ei.metadata,o)}function Ct(o,e){for(let t=0;t<o.length;t++){const i=o[t];if(i.aliases.includes(e))return i}return null}/*! @azure/msal-common v14.16.1 2025-08-05 */const Si="cache_quota_exceeded",Ri="cache_error_unknown";/*! @azure/msal-common v14.16.1 2025-08-05 */const zt={[Si]:"Exceeded cache storage capacity.",[Ri]:"Unexpected error occurred when using cache storage."};class He extends Error{constructor(e,t){const i=t||(zt[e]?zt[e]:zt[Ri]);super(`${e}: ${i}`),Object.setPrototypeOf(this,He.prototype),this.name="CacheError",this.errorCode=e,this.errorMessage=i}}function Tr(o){return o instanceof Error?o.name==="QuotaExceededError"||o.name==="NS_ERROR_DOM_QUOTA_REACHED"||o.message.includes("exceeded the quota")?new He(Si):new He(o.name,o.message):new He(Ri)}/*! @azure/msal-common v14.16.1 2025-08-05 */let wt=class Ir{constructor(e,t,i,a){this.clientId=e,this.cryptoImpl=t,this.commonLogger=i.clone(ir,vi),this.staticAuthorityOptions=a}getAllAccounts(e,t){return this.buildTenantProfiles(this.getAccountsFilteredBy(t||{},e),e,t)}getAccountInfoFilteredBy(e,t){const i=this.getAllAccounts(t,e);return i.length>1?i.sort(r=>r.idTokenClaims?-1:1)[0]:i.length===1?i[0]:null}getBaseAccountInfo(e,t){const i=this.getAccountsFilteredBy(e,t);return i.length>0?i[0].getAccountInfo():null}buildTenantProfiles(e,t,i){return e.flatMap(a=>this.getTenantProfilesFromAccountEntity(a,t,i==null?void 0:i.tenantId,i))}getTenantedAccountInfoByFilter(e,t,i,a,r){let s=null,n;if(r&&!this.tenantProfileMatchesFilter(i,r))return null;const c=this.getIdToken(e,a,t,i.tenantId);return c&&(n=Se(c.secret,this.cryptoImpl.base64Decode),!this.idTokenClaimsMatchTenantProfileFilter(n,r))?null:(s=ki(e,i,n,c==null?void 0:c.secret),s)}getTenantProfilesFromAccountEntity(e,t,i,a){const r=e.getAccountInfo();let s=r.tenantProfiles||new Map;const n=this.getTokenKeys();if(i){const l=s.get(i);if(l)s=new Map([[i,l]]);else return[]}const c=[];return s.forEach(l=>{const d=this.getTenantedAccountInfoByFilter(r,n,l,t,a);d&&c.push(d)}),c}tenantProfileMatchesFilter(e,t){return!(t.localAccountId&&!this.matchLocalAccountIdFromTenantProfile(e,t.localAccountId)||t.name&&e.name!==t.name||t.isHomeTenant!==void 0&&e.isHomeTenant!==t.isHomeTenant)}idTokenClaimsMatchTenantProfileFilter(e,t){return!(t&&(t.localAccountId&&!this.matchLocalAccountIdFromTokenClaims(e,t.localAccountId)||t.loginHint&&!this.matchLoginHintFromTokenClaims(e,t.loginHint)||t.username&&!this.matchUsername(e.preferred_username,t.username)||t.name&&!this.matchName(e,t.name)||t.sid&&!this.matchSid(e,t.sid)))}async saveCacheRecord(e,t,i){var a;if(!e)throw y(Xa);try{e.account&&this.setAccount(e.account,t),e.idToken&&(i==null?void 0:i.idToken)!==!1&&this.setIdTokenCredential(e.idToken,t),e.accessToken&&(i==null?void 0:i.accessToken)!==!1&&await this.saveAccessToken(e.accessToken,t),e.refreshToken&&(i==null?void 0:i.refreshToken)!==!1&&this.setRefreshTokenCredential(e.refreshToken,t),e.appMetadata&&this.setAppMetadata(e.appMetadata,t)}catch(r){throw(a=this.commonLogger)==null||a.error("CacheManager.saveCacheRecord: failed"),r instanceof D?r:Tr(r)}}async saveAccessToken(e,t){const i={clientId:e.clientId,credentialType:e.credentialType,environment:e.environment,homeAccountId:e.homeAccountId,realm:e.realm,tokenType:e.tokenType,requestedClaimsHash:e.requestedClaimsHash},a=this.getTokenKeys(),r=U.fromString(e.target);a.accessToken.forEach(s=>{if(!this.accessTokenKeyMatchesFilter(s,i,!1))return;const n=this.getAccessTokenCredential(s,t);n&&this.credentialMatchesFilter(n,i)&&U.fromString(n.target).intersectingScopeSets(r)&&this.removeAccessToken(s,t)}),this.setAccessTokenCredential(e,t)}getAccountsFilteredBy(e,t){const i=this.getAccountKeys(),a=[];return i.forEach(r=>{var l;if(!this.isAccountKey(r,e.homeAccountId))return;const s=this.getAccount(r,t,this.commonLogger);if(!s||e.homeAccountId&&!this.matchHomeAccountId(s,e.homeAccountId)||e.username&&!this.matchUsername(s.username,e.username)||e.environment&&!this.matchEnvironment(s,e.environment)||e.realm&&!this.matchRealm(s,e.realm)||e.nativeAccountId&&!this.matchNativeAccountId(s,e.nativeAccountId)||e.authorityType&&!this.matchAuthorityType(s,e.authorityType))return;const n={localAccountId:e==null?void 0:e.localAccountId,name:e==null?void 0:e.name},c=(l=s.tenantProfiles)==null?void 0:l.filter(d=>this.tenantProfileMatchesFilter(d,n));c&&c.length===0||a.push(s)}),a}isAccountKey(e,t,i){return!(e.split(K.CACHE_KEY_SEPARATOR).length<3||t&&!e.toLowerCase().includes(t.toLowerCase())||i&&!e.toLowerCase().includes(i.toLowerCase()))}isCredentialKey(e){if(e.split(K.CACHE_KEY_SEPARATOR).length<6)return!1;const t=e.toLowerCase();if(t.indexOf(S.ID_TOKEN.toLowerCase())===-1&&t.indexOf(S.ACCESS_TOKEN.toLowerCase())===-1&&t.indexOf(S.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase())===-1&&t.indexOf(S.REFRESH_TOKEN.toLowerCase())===-1)return!1;if(t.indexOf(S.REFRESH_TOKEN.toLowerCase())>-1){const i=`${S.REFRESH_TOKEN}${K.CACHE_KEY_SEPARATOR}${this.clientId}${K.CACHE_KEY_SEPARATOR}`,a=`${S.REFRESH_TOKEN}${K.CACHE_KEY_SEPARATOR}${We}${K.CACHE_KEY_SEPARATOR}`;if(t.indexOf(i.toLowerCase())===-1&&t.indexOf(a.toLowerCase())===-1)return!1}else if(t.indexOf(this.clientId.toLowerCase())===-1)return!1;return!0}credentialMatchesFilter(e,t){return!(t.clientId&&!this.matchClientId(e,t.clientId)||t.userAssertionHash&&!this.matchUserAssertionHash(e,t.userAssertionHash)||typeof t.homeAccountId=="string"&&!this.matchHomeAccountId(e,t.homeAccountId)||t.environment&&!this.matchEnvironment(e,t.environment)||t.realm&&!this.matchRealm(e,t.realm)||t.credentialType&&!this.matchCredentialType(e,t.credentialType)||t.familyId&&!this.matchFamilyId(e,t.familyId)||t.target&&!this.matchTarget(e,t.target)||(t.requestedClaimsHash||e.requestedClaimsHash)&&e.requestedClaimsHash!==t.requestedClaimsHash||e.credentialType===S.ACCESS_TOKEN_WITH_AUTH_SCHEME&&(t.tokenType&&!this.matchTokenType(e,t.tokenType)||t.tokenType===M.SSH&&t.keyId&&!this.matchKeyId(e,t.keyId)))}getAppMetadataFilteredBy(e){const t=this.getKeys(),i={};return t.forEach(a=>{if(!this.isAppMetadata(a))return;const r=this.getAppMetadata(a);r&&(e.environment&&!this.matchEnvironment(r,e.environment)||e.clientId&&!this.matchClientId(r,e.clientId)||(i[a]=r))}),i}getAuthorityMetadataByAlias(e){const t=this.getAuthorityMetadataKeys();let i=null;return t.forEach(a=>{if(!this.isAuthorityMetadata(a)||a.indexOf(this.clientId)===-1)return;const r=this.getAuthorityMetadata(a);r&&r.aliases.indexOf(e)!==-1&&(i=r)}),i}async removeAllAccounts(e){const t=this.getAccountKeys(),i=[];t.forEach(a=>{i.push(this.removeAccount(a,e))}),await Promise.all(i)}async removeAccount(e,t){const i=this.getAccount(e,t,this.commonLogger);i&&(await this.removeAccountContext(i,t),this.removeItem(e,t))}async removeAccountContext(e,t){const i=this.getTokenKeys(),a=e.generateAccountId();i.idToken.forEach(r=>{r.indexOf(a)===0&&this.removeIdToken(r,t)}),i.accessToken.forEach(r=>{r.indexOf(a)===0&&this.removeAccessToken(r,t)}),i.refreshToken.forEach(r=>{r.indexOf(a)===0&&this.removeRefreshToken(r,t)}),this.getKeys().forEach(r=>{r.includes(a)&&this.removeItem(r,t)})}updateOutdatedCachedAccount(e,t,i,a){var r;if(t&&t.isSingleTenant()){(r=this.commonLogger)==null||r.verbose("updateOutdatedCachedAccount: Found a single-tenant (outdated) account entity in the cache, migrating to multi-tenant account entity");const s=this.getAccountKeys().filter(u=>u.startsWith(t.homeAccountId)),n=[];s.forEach(u=>{const p=this.getCachedAccountEntity(u,i);p&&n.push(p)});const c=n.find(u=>yt(u.realm,u.homeAccountId))||n[0];c.tenantProfiles=n.map(u=>({tenantId:u.realm,localAccountId:u.localAccountId,name:u.name,isHomeTenant:yt(u.realm,u.homeAccountId)}));const l=Ir.toObject(new z,{...c}),d=l.generateAccountKey();return s.forEach(u=>{u!==d&&this.removeOutdatedAccount(e,i)}),this.setAccount(l,i),a==null||a.verbose("Updated an outdated account entity in the cache"),l}return t}removeAccessToken(e,t){const i=this.getAccessTokenCredential(e,t);if(this.removeItem(e,t),!i||i.credentialType.toLowerCase()!==S.ACCESS_TOKEN_WITH_AUTH_SCHEME.toLowerCase()||i.tokenType!==M.POP)return;const a=i.keyId;a&&this.cryptoImpl.removeTokenBindingKey(a).catch(()=>{this.commonLogger.error("Binding key could not be removed")})}removeAppMetadata(e){return this.getKeys().forEach(i=>{this.isAppMetadata(i)&&this.removeItem(i,e)}),!0}readAccountFromCache(e,t){const i=z.generateAccountCacheKey(e);return this.getAccount(i,t,this.commonLogger)}getIdToken(e,t,i,a,r){this.commonLogger.trace("CacheManager - getIdToken called");const s={homeAccountId:e.homeAccountId,environment:e.environment,credentialType:S.ID_TOKEN,clientId:this.clientId,realm:a},n=this.getIdTokensByFilter(s,t,i),c=n.size;if(c<1)return this.commonLogger.info("CacheManager:getIdToken - No token found"),null;if(c>1){let l=n;if(!a){const d=new Map;n.forEach((p,h)=>{p.realm===e.tenantId&&d.set(h,p)});const u=d.size;if(u<1)return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account but none match account entity tenant id, returning first result"),n.values().next().value;if(u===1)return this.commonLogger.info("CacheManager:getIdToken - Multiple ID tokens found for account, defaulting to home tenant profile"),d.values().next().value;l=d}return this.commonLogger.info("CacheManager:getIdToken - Multiple matching ID tokens found, clearing them"),l.forEach((d,u)=>{this.removeIdToken(u,t)}),r&&t&&r.addFields({multiMatchedID:n.size},t),null}return this.commonLogger.info("CacheManager:getIdToken - Returning ID token"),n.values().next().value}getIdTokensByFilter(e,t,i){const a=i&&i.idToken||this.getTokenKeys().idToken,r=new Map;return a.forEach(s=>{if(!this.idTokenKeyMatchesFilter(s,{clientId:this.clientId,...e}))return;const n=this.getIdTokenCredential(s,t);n&&this.credentialMatchesFilter(n,e)&&r.set(s,n)}),r}idTokenKeyMatchesFilter(e,t){const i=e.toLowerCase();return!(t.clientId&&i.indexOf(t.clientId.toLowerCase())===-1||t.homeAccountId&&i.indexOf(t.homeAccountId.toLowerCase())===-1)}removeIdToken(e,t){this.removeItem(e,t)}removeRefreshToken(e,t){this.removeItem(e,t)}getAccessToken(e,t,i,a,r){this.commonLogger.trace("CacheManager - getAccessToken called");const s=U.createSearchScopes(t.scopes),n=t.authenticationScheme||M.BEARER,c=n.toLowerCase()!==M.BEARER.toLowerCase()?S.ACCESS_TOKEN_WITH_AUTH_SCHEME:S.ACCESS_TOKEN,l={homeAccountId:e.homeAccountId,environment:e.environment,credentialType:c,clientId:this.clientId,realm:a||e.tenantId,target:s,tokenType:n,keyId:t.sshKid,requestedClaimsHash:t.requestedClaimsHash},d=i&&i.accessToken||this.getTokenKeys().accessToken,u=[];d.forEach(h=>{if(this.accessTokenKeyMatchesFilter(h,l,!0)){const m=this.getAccessTokenCredential(h,t.correlationId);m&&this.credentialMatchesFilter(m,l)&&u.push(m)}});const p=u.length;return p<1?(this.commonLogger.info("CacheManager:getAccessToken - No token found"),null):p>1?(this.commonLogger.info("CacheManager:getAccessToken - Multiple access tokens found, clearing them"),u.forEach(h=>{this.removeAccessToken(Oe(h),t.correlationId)}),r&&t.correlationId&&r.addFields({multiMatchedAT:u.length},t.correlationId),null):(this.commonLogger.info("CacheManager:getAccessToken - Returning access token"),u[0])}accessTokenKeyMatchesFilter(e,t,i){const a=e.toLowerCase();if(t.clientId&&a.indexOf(t.clientId.toLowerCase())===-1||t.homeAccountId&&a.indexOf(t.homeAccountId.toLowerCase())===-1||t.realm&&a.indexOf(t.realm.toLowerCase())===-1||t.requestedClaimsHash&&a.indexOf(t.requestedClaimsHash.toLowerCase())===-1)return!1;if(t.target){const r=t.target.asArray();for(let s=0;s<r.length;s++){if(i&&!a.includes(r[s].toLowerCase()))return!1;if(!i&&a.includes(r[s].toLowerCase()))return!0}}return!0}getAccessTokensByFilter(e,t){const i=this.getTokenKeys(),a=[];return i.accessToken.forEach(r=>{if(!this.accessTokenKeyMatchesFilter(r,e,!0))return;const s=this.getAccessTokenCredential(r,t);s&&this.credentialMatchesFilter(s,e)&&a.push(s)}),a}getRefreshToken(e,t,i,a,r){this.commonLogger.trace("CacheManager - getRefreshToken called");const s=t?We:void 0,n={homeAccountId:e.homeAccountId,environment:e.environment,credentialType:S.REFRESH_TOKEN,clientId:this.clientId,familyId:s},c=a&&a.refreshToken||this.getTokenKeys().refreshToken,l=[];c.forEach(u=>{if(this.refreshTokenKeyMatchesFilter(u,n)){const p=this.getRefreshTokenCredential(u,i);p&&this.credentialMatchesFilter(p,n)&&l.push(p)}});const d=l.length;return d<1?(this.commonLogger.info("CacheManager:getRefreshToken - No refresh token found."),null):(d>1&&r&&i&&r.addFields({multiMatchedRT:d},i),this.commonLogger.info("CacheManager:getRefreshToken - returning refresh token"),l[0])}refreshTokenKeyMatchesFilter(e,t){const i=e.toLowerCase();return!(t.familyId&&i.indexOf(t.familyId.toLowerCase())===-1||!t.familyId&&t.clientId&&i.indexOf(t.clientId.toLowerCase())===-1||t.homeAccountId&&i.indexOf(t.homeAccountId.toLowerCase())===-1)}readAppMetadataFromCache(e){const t={environment:e,clientId:this.clientId},i=this.getAppMetadataFilteredBy(t),a=Object.keys(i).map(s=>i[s]),r=a.length;if(r<1)return null;if(r>1)throw y(Ya);return a[0]}isAppMetadataFOCI(e){const t=this.readAppMetadataFromCache(e);return!!(t&&t.familyId===We)}matchHomeAccountId(e,t){return typeof e.homeAccountId=="string"&&t===e.homeAccountId}matchLocalAccountIdFromTokenClaims(e,t){const i=e.oid||e.sub;return t===i}matchLocalAccountIdFromTenantProfile(e,t){return e.localAccountId===t}matchName(e,t){var i;return t.toLowerCase()===((i=e.name)==null?void 0:i.toLowerCase())}matchUsername(e,t){return!!(e&&typeof e=="string"&&(t==null?void 0:t.toLowerCase())===e.toLowerCase())}matchUserAssertionHash(e,t){return!!(e.userAssertionHash&&t===e.userAssertionHash)}matchEnvironment(e,t){if(this.staticAuthorityOptions){const a=pn(this.staticAuthorityOptions,this.commonLogger);if(a.includes(t)&&a.includes(e.environment))return!0}const i=this.getAuthorityMetadataByAlias(t);return!!(i&&i.aliases.indexOf(e.environment)>-1)}matchCredentialType(e,t){return e.credentialType&&t.toLowerCase()===e.credentialType.toLowerCase()}matchClientId(e,t){return!!(e.clientId&&t===e.clientId)}matchFamilyId(e,t){return!!(e.familyId&&t===e.familyId)}matchRealm(e,t){var i;return((i=e.realm)==null?void 0:i.toLowerCase())===t.toLowerCase()}matchNativeAccountId(e,t){return!!(e.nativeAccountId&&t===e.nativeAccountId)}matchLoginHintFromTokenClaims(e,t){return e.login_hint===t||e.preferred_username===t||e.upn===t}matchSid(e,t){return e.sid===t}matchAuthorityType(e,t){return!!(e.authorityType&&t.toLowerCase()===e.authorityType.toLowerCase())}matchTarget(e,t){return e.credentialType!==S.ACCESS_TOKEN&&e.credentialType!==S.ACCESS_TOKEN_WITH_AUTH_SCHEME||!e.target?!1:U.fromString(e.target).containsScopeSet(t)}matchTokenType(e,t){return!!(e.tokenType&&e.tokenType===t)}matchKeyId(e,t){return!!(e.keyId&&e.keyId===t)}isAppMetadata(e){return e.indexOf(li)!==-1}isAuthorityMetadata(e){return e.indexOf(gt.CACHE_KEY)!==-1}generateAuthorityMetadataCacheKey(e){return`${gt.CACHE_KEY}-${this.clientId}-${e}`}static toObject(e,t){for(const i in t)e[i]=t[i];return e}};class mn extends wt{setAccount(){throw y(R)}getAccount(){throw y(R)}getCachedAccountEntity(){throw y(R)}setIdTokenCredential(){throw y(R)}getIdTokenCredential(){throw y(R)}setAccessTokenCredential(){throw y(R)}getAccessTokenCredential(){throw y(R)}setRefreshTokenCredential(){throw y(R)}getRefreshTokenCredential(){throw y(R)}setAppMetadata(){throw y(R)}getAppMetadata(){throw y(R)}setServerTelemetry(){throw y(R)}getServerTelemetry(){throw y(R)}setAuthorityMetadata(){throw y(R)}getAuthorityMetadata(){throw y(R)}getAuthorityMetadataKeys(){throw y(R)}setThrottlingCache(){throw y(R)}getThrottlingCache(){throw y(R)}removeItem(){throw y(R)}getKeys(){throw y(R)}getAccountKeys(){throw y(R)}getTokenKeys(){throw y(R)}updateCredentialCacheKey(){throw y(R)}removeOutdatedAccount(){throw y(R)}}/*! @azure/msal-common v14.16.1 2025-08-05 */const kr={tokenRenewalOffsetSeconds:$s,preventCorsPreflight:!1},fn={loggerCallback:()=>{},piiLoggingEnabled:!1,logLevel:L.Info,correlationId:f.EMPTY_STRING},vn={claimsBasedCachingEnabled:!1},yn={async sendGetRequestAsync(){throw y(R)},async sendPostRequestAsync(){throw y(R)}},bn={sku:f.SKU,version:vi,cpu:f.EMPTY_STRING,os:f.EMPTY_STRING},Cn={clientSecret:f.EMPTY_STRING,clientAssertion:void 0},wn={azureCloudInstance:yi.None,tenant:`${f.DEFAULT_COMMON_TENANT}`},An={application:{appName:"",appVersion:""}};function Tn({authOptions:o,systemOptions:e,loggerOptions:t,cacheOptions:i,storageInterface:a,networkInterface:r,cryptoInterface:s,clientCredentials:n,libraryInfo:c,telemetry:l,serverTelemetryManager:d,persistencePlugin:u,serializableCache:p}){const h={...fn,...t};return{authOptions:In(o),systemOptions:{...kr,...e},loggerOptions:h,cacheOptions:{...vn,...i},storageInterface:a||new mn(o.clientId,ft,new Ce(h)),networkInterface:r||yn,cryptoInterface:s||ft,clientCredentials:n||Cn,libraryInfo:{...bn,...c},telemetry:{...An,...l},serverTelemetryManager:d||null,persistencePlugin:u||null,serializableCache:p||null}}function In(o){return{clientCapabilities:[],azureCloudOptions:wn,skipAuthorityMetadataCache:!1,instanceAware:!1,...o}}function Qt(o){return o.authOptions.authority.options.protocolMode===ve.OIDC}/*! @azure/msal-common v14.16.1 2025-08-05 */const X={HOME_ACCOUNT_ID:"home_account_id",UPN:"UPN"};/*! @azure/msal-common v14.16.1 2025-08-05 */const Te="client_id",Er="redirect_uri",ga="response_type",kn="response_mode",En="grant_type",Sn="claims",Rn="scope",xn="refresh_token",Pn="state",_n="nonce",Mn="prompt",Nn="code",On="code_challenge",$n="code_challenge_method",Dn="code_verifier",Ln="client-request-id",Hn="x-client-SKU",Un="x-client-VER",zn="x-client-OS",qn="x-client-CPU",Fn="x-client-current-telemetry",Bn="x-client-last-telemetry",Gn="x-ms-lib-capability",Kn="x-app-name",jn="x-app-ver",Vn="post_logout_redirect_uri",Yn="id_token_hint",Wn="device_code",Jn="client_secret",Qn="client_assertion",Xn="client_assertion_type",ma="token_type",fa="req_cnf",Zn="assertion",eo="requested_token_use",va="return_spa_code",to="nativebroker",io="logout_hint",ao="sid",ro="login_hint",so="domain_hint",no="x-client-xtra-sku",xi="brk_client_id",Xt="brk_redirect_uri";/*! @azure/msal-common v14.16.1 2025-08-05 */class _e{static validateRedirectUri(e){if(!e)throw O(sr)}static validatePrompt(e){const t=[];for(const i in F)t.push(F[i]);if(t.indexOf(e)<0)throw O(lr)}static validateClaims(e){try{JSON.parse(e)}catch{throw O(Ci)}}static validateCodeChallengeParams(e,t){if(!e||!t)throw O(wi);this.validateCodeChallengeMethod(t)}static validateCodeChallengeMethod(e){if([ia.PLAIN,ia.S256].indexOf(e)<0)throw O(hr)}}/*! @azure/msal-common v14.16.1 2025-08-05 */function oo(o,e,t){if(!e)return;const i=o.get(Te);i&&o.has(xi)&&(t==null||t.addFields({embeddedClientId:i,embeddedRedirectUri:o.get(Er)},e))}class Qe{constructor(e,t){this.parameters=new Map,this.performanceClient=t,this.correlationId=e}addResponseTypeCode(){this.parameters.set(ga,encodeURIComponent(f.CODE_RESPONSE_TYPE))}addResponseTypeForTokenAndIdToken(){this.parameters.set(ga,encodeURIComponent(`${f.TOKEN_RESPONSE_TYPE} ${f.ID_TOKEN_RESPONSE_TYPE}`))}addResponseMode(e){this.parameters.set(kn,encodeURIComponent(e||Ms.QUERY))}addNativeBroker(){this.parameters.set(to,encodeURIComponent("1"))}addScopes(e,t=!0,i=Ge){t&&!i.includes("openid")&&!e.includes("openid")&&i.push("openid");const a=t?[...e||[],...i]:e||[],r=new U(a);this.parameters.set(Rn,encodeURIComponent(r.printScopes()))}addClientId(e){this.parameters.set(Te,encodeURIComponent(e))}addRedirectUri(e){_e.validateRedirectUri(e),this.parameters.set(Er,encodeURIComponent(e))}addPostLogoutRedirectUri(e){_e.validateRedirectUri(e),this.parameters.set(Vn,encodeURIComponent(e))}addIdTokenHint(e){this.parameters.set(Yn,encodeURIComponent(e))}addDomainHint(e){this.parameters.set(so,encodeURIComponent(e))}addLoginHint(e){this.parameters.set(ro,encodeURIComponent(e))}addCcsUpn(e){this.parameters.set(j.CCS_HEADER,encodeURIComponent(`UPN:${e}`))}addCcsOid(e){this.parameters.set(j.CCS_HEADER,encodeURIComponent(`Oid:${e.uid}@${e.utid}`))}addSid(e){this.parameters.set(ao,encodeURIComponent(e))}addClaims(e,t){const i=this.addClientCapabilitiesToClaims(e,t);_e.validateClaims(i),this.parameters.set(Sn,encodeURIComponent(i))}addCorrelationId(e){this.parameters.set(Ln,encodeURIComponent(e))}addLibraryInfo(e){this.parameters.set(Hn,e.sku),this.parameters.set(Un,e.version),e.os&&this.parameters.set(zn,e.os),e.cpu&&this.parameters.set(qn,e.cpu)}addApplicationTelemetry(e){e!=null&&e.appName&&this.parameters.set(Kn,e.appName),e!=null&&e.appVersion&&this.parameters.set(jn,e.appVersion)}addPrompt(e){_e.validatePrompt(e),this.parameters.set(`${Mn}`,encodeURIComponent(e))}addState(e){e&&this.parameters.set(Pn,encodeURIComponent(e))}addNonce(e){this.parameters.set(_n,encodeURIComponent(e))}addCodeChallengeParams(e,t){if(_e.validateCodeChallengeParams(e,t),e&&t)this.parameters.set(On,encodeURIComponent(e)),this.parameters.set($n,encodeURIComponent(t));else throw O(wi)}addAuthorizationCode(e){this.parameters.set(Nn,encodeURIComponent(e))}addDeviceCode(e){this.parameters.set(Wn,encodeURIComponent(e))}addRefreshToken(e){this.parameters.set(xn,encodeURIComponent(e))}addCodeVerifier(e){this.parameters.set(Dn,encodeURIComponent(e))}addClientSecret(e){this.parameters.set(Jn,encodeURIComponent(e))}addClientAssertion(e){e&&this.parameters.set(Qn,encodeURIComponent(e))}addClientAssertionType(e){e&&this.parameters.set(Xn,encodeURIComponent(e))}addOboAssertion(e){this.parameters.set(Zn,encodeURIComponent(e))}addRequestTokenUse(e){this.parameters.set(eo,encodeURIComponent(e))}addGrantType(e){this.parameters.set(En,encodeURIComponent(e))}addClientInfo(){this.parameters.set(Ns,"1")}addExtraQueryParameters(e){Object.entries(e).forEach(([t,i])=>{!this.parameters.has(t)&&i&&this.parameters.set(t,i)})}addClientCapabilitiesToClaims(e,t){let i;if(!e)i={};else try{i=JSON.parse(e)}catch{throw O(Ci)}return t&&t.length>0&&(i.hasOwnProperty(st.ACCESS_TOKEN)||(i[st.ACCESS_TOKEN]={}),i[st.ACCESS_TOKEN][st.XMS_CC]={values:t}),JSON.stringify(i)}addUsername(e){this.parameters.set(ra.username,encodeURIComponent(e))}addPassword(e){this.parameters.set(ra.password,encodeURIComponent(e))}addPopToken(e){e&&(this.parameters.set(ma,M.POP),this.parameters.set(fa,encodeURIComponent(e)))}addSshJwk(e){e&&(this.parameters.set(ma,M.SSH),this.parameters.set(fa,encodeURIComponent(e)))}addServerTelemetry(e){this.parameters.set(Fn,e.generateCurrentRequestHeaderValue()),this.parameters.set(Bn,e.generateLastRequestHeaderValue())}addThrottling(){this.parameters.set(Gn,Je.X_MS_LIB_CAPABILITY_VALUE)}addLogoutHint(e){this.parameters.set(io,encodeURIComponent(e))}addBrokerParameters(e){const t={};t[xi]=e.brokerClientId,t[Xt]=e.brokerRedirectUri,this.addExtraQueryParameters(t)}createQueryString(){const e=new Array;return this.parameters.forEach((t,i)=>{e.push(`${i}=${t}`)}),oo(this.parameters,this.correlationId,this.performanceClient),e.join("&")}}/*! @azure/msal-common v14.16.1 2025-08-05 */function co(o){return o.hasOwnProperty("authorization_endpoint")&&o.hasOwnProperty("token_endpoint")&&o.hasOwnProperty("issuer")&&o.hasOwnProperty("jwks_uri")}/*! @azure/msal-common v14.16.1 2025-08-05 */function lo(o){return o.hasOwnProperty("tenant_discovery_endpoint")&&o.hasOwnProperty("metadata")}/*! @azure/msal-common v14.16.1 2025-08-05 */function uo(o){return o.hasOwnProperty("error")&&o.hasOwnProperty("error_description")}/*! @azure/msal-common v14.16.1 2025-08-05 */const g={AcquireTokenByCode:"acquireTokenByCode",AcquireTokenByRefreshToken:"acquireTokenByRefreshToken",AcquireTokenSilent:"acquireTokenSilent",AcquireTokenSilentAsync:"acquireTokenSilentAsync",AcquireTokenPopup:"acquireTokenPopup",AcquireTokenPreRedirect:"acquireTokenPreRedirect",AcquireTokenRedirect:"acquireTokenRedirect",CryptoOptsGetPublicKeyThumbprint:"cryptoOptsGetPublicKeyThumbprint",CryptoOptsSignJwt:"cryptoOptsSignJwt",SilentCacheClientAcquireToken:"silentCacheClientAcquireToken",SilentIframeClientAcquireToken:"silentIframeClientAcquireToken",AwaitConcurrentIframe:"awaitConcurrentIframe",SilentRefreshClientAcquireToken:"silentRefreshClientAcquireToken",SsoSilent:"ssoSilent",StandardInteractionClientGetDiscoveredAuthority:"standardInteractionClientGetDiscoveredAuthority",FetchAccountIdWithNativeBroker:"fetchAccountIdWithNativeBroker",NativeInteractionClientAcquireToken:"nativeInteractionClientAcquireToken",BaseClientCreateTokenRequestHeaders:"baseClientCreateTokenRequestHeaders",NetworkClientSendPostRequestAsync:"networkClientSendPostRequestAsync",RefreshTokenClientExecutePostToTokenEndpoint:"refreshTokenClientExecutePostToTokenEndpoint",AuthorizationCodeClientExecutePostToTokenEndpoint:"authorizationCodeClientExecutePostToTokenEndpoint",BrokerHandhshake:"brokerHandshake",AcquireTokenByRefreshTokenInBroker:"acquireTokenByRefreshTokenInBroker",AcquireTokenByBroker:"acquireTokenByBroker",RefreshTokenClientExecuteTokenRequest:"refreshTokenClientExecuteTokenRequest",RefreshTokenClientAcquireToken:"refreshTokenClientAcquireToken",RefreshTokenClientAcquireTokenWithCachedRefreshToken:"refreshTokenClientAcquireTokenWithCachedRefreshToken",RefreshTokenClientAcquireTokenByRefreshToken:"refreshTokenClientAcquireTokenByRefreshToken",RefreshTokenClientCreateTokenRequestBody:"refreshTokenClientCreateTokenRequestBody",AcquireTokenFromCache:"acquireTokenFromCache",SilentFlowClientAcquireCachedToken:"silentFlowClientAcquireCachedToken",SilentFlowClientGenerateResultFromCacheRecord:"silentFlowClientGenerateResultFromCacheRecord",AcquireTokenBySilentIframe:"acquireTokenBySilentIframe",InitializeBaseRequest:"initializeBaseRequest",InitializeSilentRequest:"initializeSilentRequest",InitializeClientApplication:"initializeClientApplication",SilentIframeClientTokenHelper:"silentIframeClientTokenHelper",SilentHandlerInitiateAuthRequest:"silentHandlerInitiateAuthRequest",SilentHandlerMonitorIframeForHash:"silentHandlerMonitorIframeForHash",SilentHandlerLoadFrame:"silentHandlerLoadFrame",SilentHandlerLoadFrameSync:"silentHandlerLoadFrameSync",StandardInteractionClientCreateAuthCodeClient:"standardInteractionClientCreateAuthCodeClient",StandardInteractionClientGetClientConfiguration:"standardInteractionClientGetClientConfiguration",StandardInteractionClientInitializeAuthorizationRequest:"standardInteractionClientInitializeAuthorizationRequest",StandardInteractionClientInitializeAuthorizationCodeRequest:"standardInteractionClientInitializeAuthorizationCodeRequest",GetAuthCodeUrl:"getAuthCodeUrl",HandleCodeResponseFromServer:"handleCodeResponseFromServer",HandleCodeResponse:"handleCodeResponse",UpdateTokenEndpointAuthority:"updateTokenEndpointAuthority",AuthClientAcquireToken:"authClientAcquireToken",AuthClientExecuteTokenRequest:"authClientExecuteTokenRequest",AuthClientCreateTokenRequestBody:"authClientCreateTokenRequestBody",AuthClientCreateQueryString:"authClientCreateQueryString",PopTokenGenerateCnf:"popTokenGenerateCnf",PopTokenGenerateKid:"popTokenGenerateKid",HandleServerTokenResponse:"handleServerTokenResponse",DeserializeResponse:"deserializeResponse",AuthorityFactoryCreateDiscoveredInstance:"authorityFactoryCreateDiscoveredInstance",AuthorityResolveEndpointsAsync:"authorityResolveEndpointsAsync",AuthorityResolveEndpointsFromLocalSources:"authorityResolveEndpointsFromLocalSources",AuthorityGetCloudDiscoveryMetadataFromNetwork:"authorityGetCloudDiscoveryMetadataFromNetwork",AuthorityUpdateCloudDiscoveryMetadata:"authorityUpdateCloudDiscoveryMetadata",AuthorityGetEndpointMetadataFromNetwork:"authorityGetEndpointMetadataFromNetwork",AuthorityUpdateEndpointMetadata:"authorityUpdateEndpointMetadata",AuthorityUpdateMetadataWithRegionalInformation:"authorityUpdateMetadataWithRegionalInformation",RegionDiscoveryDetectRegion:"regionDiscoveryDetectRegion",RegionDiscoveryGetRegionFromIMDS:"regionDiscoveryGetRegionFromIMDS",RegionDiscoveryGetCurrentVersion:"regionDiscoveryGetCurrentVersion",AcquireTokenByCodeAsync:"acquireTokenByCodeAsync",GetEndpointMetadataFromNetwork:"getEndpointMetadataFromNetwork",GetCloudDiscoveryMetadataFromNetworkMeasurement:"getCloudDiscoveryMetadataFromNetworkMeasurement",HandleRedirectPromiseMeasurement:"handleRedirectPromise",HandleNativeRedirectPromiseMeasurement:"handleNativeRedirectPromise",UpdateCloudDiscoveryMetadataMeasurement:"updateCloudDiscoveryMetadataMeasurement",UsernamePasswordClientAcquireToken:"usernamePasswordClientAcquireToken",NativeMessageHandlerHandshake:"nativeMessageHandlerHandshake",NativeGenerateAuthResult:"nativeGenerateAuthResult",RemoveHiddenIframe:"removeHiddenIframe",ClearTokensAndKeysWithClaims:"clearTokensAndKeysWithClaims",CacheManagerGetRefreshToken:"cacheManagerGetRefreshToken",GeneratePkceCodes:"generatePkceCodes",GenerateCodeVerifier:"generateCodeVerifier",GenerateCodeChallengeFromVerifier:"generateCodeChallengeFromVerifier",Sha256Digest:"sha256Digest",GetRandomValues:"getRandomValues"},ho={InProgress:1};/*! @azure/msal-common v14.16.1 2025-08-05 */const Re=(o,e,t,i,a)=>(...r)=>{t.trace(`Executing function ${e}`);const s=i==null?void 0:i.startMeasurement(e,a);if(a){const n=e+"CallCount";i==null||i.incrementFields({[n]:1},a)}try{const n=o(...r);return s==null||s.end({success:!0}),t.trace(`Returning result from ${e}`),n}catch(n){t.trace(`Error occurred in ${e}`);try{t.trace(JSON.stringify(n))}catch{t.trace("Unable to print error message.")}throw s==null||s.end({success:!1},n),n}},b=(o,e,t,i,a)=>(...r)=>{t.trace(`Executing function ${e}`);const s=i==null?void 0:i.startMeasurement(e,a);if(a){const n=e+"CallCount";i==null||i.incrementFields({[n]:1},a)}return i==null||i.setPreQueueTime(e,a),o(...r).then(n=>(t.trace(`Returning result from ${e}`),s==null||s.end({success:!0}),n)).catch(n=>{t.trace(`Error occurred in ${e}`);try{t.trace(JSON.stringify(n))}catch{t.trace("Unable to print error message.")}throw s==null||s.end({success:!1},n),n})};/*! @azure/msal-common v14.16.1 2025-08-05 */class xt{constructor(e,t,i,a){this.networkInterface=e,this.logger=t,this.performanceClient=i,this.correlationId=a}async detectRegion(e,t){var a;(a=this.performanceClient)==null||a.addQueueMeasurement(g.RegionDiscoveryDetectRegion,this.correlationId);let i=e;if(i)t.region_source=Pe.ENVIRONMENT_VARIABLE;else{const r=xt.IMDS_OPTIONS;try{const s=await b(this.getRegionFromIMDS.bind(this),g.RegionDiscoveryGetRegionFromIMDS,this.logger,this.performanceClient,this.correlationId)(f.IMDS_VERSION,r);if(s.status===ot.httpSuccess&&(i=s.body,t.region_source=Pe.IMDS),s.status===ot.httpBadRequest){const n=await b(this.getCurrentVersion.bind(this),g.RegionDiscoveryGetCurrentVersion,this.logger,this.performanceClient,this.correlationId)(r);if(!n)return t.region_source=Pe.FAILED_AUTO_DETECTION,null;const c=await b(this.getRegionFromIMDS.bind(this),g.RegionDiscoveryGetRegionFromIMDS,this.logger,this.performanceClient,this.correlationId)(n,r);c.status===ot.httpSuccess&&(i=c.body,t.region_source=Pe.IMDS)}}catch{return t.region_source=Pe.FAILED_AUTO_DETECTION,null}}return i||(t.region_source=Pe.FAILED_AUTO_DETECTION),i||null}async getRegionFromIMDS(e,t){var i;return(i=this.performanceClient)==null||i.addQueueMeasurement(g.RegionDiscoveryGetRegionFromIMDS,this.correlationId),this.networkInterface.sendGetRequestAsync(`${f.IMDS_ENDPOINT}?api-version=${e}&format=text`,t,f.IMDS_TIMEOUT)}async getCurrentVersion(e){var t;(t=this.performanceClient)==null||t.addQueueMeasurement(g.RegionDiscoveryGetCurrentVersion,this.correlationId);try{const i=await this.networkInterface.sendGetRequestAsync(`${f.IMDS_ENDPOINT}?format=json`,e);return i.status===ot.httpBadRequest&&i.body&&i.body["newest-versions"]&&i.body["newest-versions"].length>0?i.body["newest-versions"][0]:null}catch{return null}}}xt.IMDS_OPTIONS={headers:{Metadata:"true"}};/*! @azure/msal-common v14.16.1 2025-08-05 */class G{constructor(e,t,i,a,r,s,n,c){this.canonicalAuthority=e,this._canonicalAuthority.validateAsUri(),this.networkInterface=t,this.cacheManager=i,this.authorityOptions=a,this.regionDiscoveryMetadata={region_used:void 0,region_source:void 0,region_outcome:void 0},this.logger=r,this.performanceClient=n,this.correlationId=s,this.managedIdentity=c||!1,this.regionDiscovery=new xt(t,this.logger,this.performanceClient,this.correlationId)}getAuthorityType(e){if(e.HostNameAndPort.endsWith(f.CIAM_AUTH_URL))return te.Ciam;const t=e.PathSegments;if(t.length)switch(t[0].toLowerCase()){case f.ADFS:return te.Adfs;case f.DSTS:return te.Dsts}return te.Default}get authorityType(){return this.getAuthorityType(this.canonicalAuthorityUrlComponents)}get protocolMode(){return this.authorityOptions.protocolMode}get options(){return this.authorityOptions}get canonicalAuthority(){return this._canonicalAuthority.urlString}set canonicalAuthority(e){this._canonicalAuthority=new x(e),this._canonicalAuthority.validateAsUri(),this._canonicalAuthorityUrlComponents=null}get canonicalAuthorityUrlComponents(){return this._canonicalAuthorityUrlComponents||(this._canonicalAuthorityUrlComponents=this._canonicalAuthority.getUrlComponents()),this._canonicalAuthorityUrlComponents}get hostnameAndPort(){return this.canonicalAuthorityUrlComponents.HostNameAndPort.toLowerCase()}get tenant(){return this.canonicalAuthorityUrlComponents.PathSegments[0]}get authorizationEndpoint(){if(this.discoveryComplete())return this.replacePath(this.metadata.authorization_endpoint);throw y(ge)}get tokenEndpoint(){if(this.discoveryComplete())return this.replacePath(this.metadata.token_endpoint);throw y(ge)}get deviceCodeEndpoint(){if(this.discoveryComplete())return this.replacePath(this.metadata.token_endpoint.replace("/token","/devicecode"));throw y(ge)}get endSessionEndpoint(){if(this.discoveryComplete()){if(!this.metadata.end_session_endpoint)throw y(tr);return this.replacePath(this.metadata.end_session_endpoint)}else throw y(ge)}get selfSignedJwtAudience(){if(this.discoveryComplete())return this.replacePath(this.metadata.issuer);throw y(ge)}get jwksUri(){if(this.discoveryComplete())return this.replacePath(this.metadata.jwks_uri);throw y(ge)}canReplaceTenant(e){return e.PathSegments.length===1&&!G.reservedTenantDomains.has(e.PathSegments[0])&&this.getAuthorityType(e)===te.Default&&this.protocolMode===ve.AAD}replaceTenant(e){return e.replace(/{tenant}|{tenantid}/g,this.tenant)}replacePath(e){let t=e;const a=new x(this.metadata.canonical_authority).getUrlComponents(),r=a.PathSegments;return this.canonicalAuthorityUrlComponents.PathSegments.forEach((n,c)=>{let l=r[c];if(c===0&&this.canReplaceTenant(a)){const d=new x(this.metadata.authorization_endpoint).getUrlComponents().PathSegments[0];l!==d&&(this.logger.verbose(`Replacing tenant domain name ${l} with id ${d}`),l=d)}n!==l&&(t=t.replace(`/${l}/`,`/${n}/`))}),this.replaceTenant(t)}get defaultOpenIdConfigurationEndpoint(){const e=this.hostnameAndPort;return this.canonicalAuthority.endsWith("v2.0/")||this.authorityType===te.Adfs||this.protocolMode!==ve.AAD&&!this.isAliasOfKnownMicrosoftAuthority(e)?`${this.canonicalAuthority}.well-known/openid-configuration`:`${this.canonicalAuthority}v2.0/.well-known/openid-configuration`}discoveryComplete(){return!!this.metadata}async resolveEndpointsAsync(){var a,r;(a=this.performanceClient)==null||a.addQueueMeasurement(g.AuthorityResolveEndpointsAsync,this.correlationId);const e=this.getCurrentMetadataEntity(),t=await b(this.updateCloudDiscoveryMetadata.bind(this),g.AuthorityUpdateCloudDiscoveryMetadata,this.logger,this.performanceClient,this.correlationId)(e);this.canonicalAuthority=this.canonicalAuthority.replace(this.hostnameAndPort,e.preferred_network);const i=await b(this.updateEndpointMetadata.bind(this),g.AuthorityUpdateEndpointMetadata,this.logger,this.performanceClient,this.correlationId)(e);this.updateCachedMetadata(e,t,{source:i}),(r=this.performanceClient)==null||r.addFields({cloudDiscoverySource:t,authorityEndpointSource:i},this.correlationId)}getCurrentMetadataEntity(){let e=this.cacheManager.getAuthorityMetadataByAlias(this.hostnameAndPort);return e||(e={aliases:[],preferred_cache:this.hostnameAndPort,preferred_network:this.hostnameAndPort,canonical_authority:this.canonicalAuthority,authorization_endpoint:"",token_endpoint:"",end_session_endpoint:"",issuer:"",aliasesFromNetwork:!1,endpointsFromNetwork:!1,expiresAt:da(),jwks_uri:""}),e}updateCachedMetadata(e,t,i){t!==W.CACHE&&(i==null?void 0:i.source)!==W.CACHE&&(e.expiresAt=da(),e.canonical_authority=this.canonicalAuthority);const a=this.cacheManager.generateAuthorityMetadataCacheKey(e.preferred_cache);this.cacheManager.setAuthorityMetadata(a,e),this.metadata=e}async updateEndpointMetadata(e){var a,r,s;(a=this.performanceClient)==null||a.addQueueMeasurement(g.AuthorityUpdateEndpointMetadata,this.correlationId);const t=this.updateEndpointMetadataFromLocalSources(e);if(t){if(t.source===W.HARDCODED_VALUES&&(r=this.authorityOptions.azureRegionConfiguration)!=null&&r.azureRegion&&t.metadata){const n=await b(this.updateMetadataWithRegionalInformation.bind(this),g.AuthorityUpdateMetadataWithRegionalInformation,this.logger,this.performanceClient,this.correlationId)(t.metadata);ct(e,n,!1),e.canonical_authority=this.canonicalAuthority}return t.source}let i=await b(this.getEndpointMetadataFromNetwork.bind(this),g.AuthorityGetEndpointMetadataFromNetwork,this.logger,this.performanceClient,this.correlationId)();if(i)return(s=this.authorityOptions.azureRegionConfiguration)!=null&&s.azureRegion&&(i=await b(this.updateMetadataWithRegionalInformation.bind(this),g.AuthorityUpdateMetadataWithRegionalInformation,this.logger,this.performanceClient,this.correlationId)(i)),ct(e,i,!0),W.NETWORK;throw y(Ba,this.defaultOpenIdConfigurationEndpoint)}updateEndpointMetadataFromLocalSources(e){this.logger.verbose("Attempting to get endpoint metadata from authority configuration");const t=this.getEndpointMetadataFromConfig();if(t)return this.logger.verbose("Found endpoint metadata in authority configuration"),ct(e,t,!1),{source:W.CONFIG};if(this.logger.verbose("Did not find endpoint metadata in the config... Attempting to get endpoint metadata from the hardcoded values."),this.authorityOptions.skipAuthorityMetadataCache)this.logger.verbose("Skipping hardcoded metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get endpoint metadata from the network metadata cache.");else{const a=this.getEndpointMetadataFromHardcodedValues();if(a)return ct(e,a,!1),{source:W.HARDCODED_VALUES,metadata:a};this.logger.verbose("Did not find endpoint metadata in hardcoded values... Attempting to get endpoint metadata from the network metadata cache.")}const i=ua(e);return this.isAuthoritySameType(e)&&e.endpointsFromNetwork&&!i?(this.logger.verbose("Found endpoint metadata in the cache."),{source:W.CACHE}):(i&&this.logger.verbose("The metadata entity is expired."),null)}isAuthoritySameType(e){return new x(e.canonical_authority).getUrlComponents().PathSegments.length===this.canonicalAuthorityUrlComponents.PathSegments.length}getEndpointMetadataFromConfig(){if(this.authorityOptions.authorityMetadata)try{return JSON.parse(this.authorityOptions.authorityMetadata)}catch{throw O(pr)}return null}async getEndpointMetadataFromNetwork(){var i;(i=this.performanceClient)==null||i.addQueueMeasurement(g.AuthorityGetEndpointMetadataFromNetwork,this.correlationId);const e={},t=this.defaultOpenIdConfigurationEndpoint;this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: attempting to retrieve OAuth endpoints from ${t}`);try{const a=await this.networkInterface.sendGetRequestAsync(t,e);return co(a.body)?a.body:(this.logger.verbose("Authority.getEndpointMetadataFromNetwork: could not parse response as OpenID configuration"),null)}catch(a){return this.logger.verbose(`Authority.getEndpointMetadataFromNetwork: ${a}`),null}}getEndpointMetadataFromHardcodedValues(){return this.hostnameAndPort in ha?ha[this.hostnameAndPort]:null}async updateMetadataWithRegionalInformation(e){var i,a,r;(i=this.performanceClient)==null||i.addQueueMeasurement(g.AuthorityUpdateMetadataWithRegionalInformation,this.correlationId);const t=(a=this.authorityOptions.azureRegionConfiguration)==null?void 0:a.azureRegion;if(t){if(t!==f.AZURE_REGION_AUTO_DISCOVER_FLAG)return this.regionDiscoveryMetadata.region_outcome=Ht.CONFIGURED_NO_AUTO_DETECTION,this.regionDiscoveryMetadata.region_used=t,G.replaceWithRegionalInformation(e,t);const s=await b(this.regionDiscovery.detectRegion.bind(this.regionDiscovery),g.RegionDiscoveryDetectRegion,this.logger,this.performanceClient,this.correlationId)((r=this.authorityOptions.azureRegionConfiguration)==null?void 0:r.environmentRegion,this.regionDiscoveryMetadata);if(s)return this.regionDiscoveryMetadata.region_outcome=Ht.AUTO_DETECTION_REQUESTED_SUCCESSFUL,this.regionDiscoveryMetadata.region_used=s,G.replaceWithRegionalInformation(e,s);this.regionDiscoveryMetadata.region_outcome=Ht.AUTO_DETECTION_REQUESTED_FAILED}return e}async updateCloudDiscoveryMetadata(e){var a;(a=this.performanceClient)==null||a.addQueueMeasurement(g.AuthorityUpdateCloudDiscoveryMetadata,this.correlationId);const t=this.updateCloudDiscoveryMetadataFromLocalSources(e);if(t)return t;const i=await b(this.getCloudDiscoveryMetadataFromNetwork.bind(this),g.AuthorityGetCloudDiscoveryMetadataFromNetwork,this.logger,this.performanceClient,this.correlationId)();if(i)return Ut(e,i,!0),W.NETWORK;throw O(gr)}updateCloudDiscoveryMetadataFromLocalSources(e){this.logger.verbose("Attempting to get cloud discovery metadata  from authority configuration"),this.logger.verbosePii(`Known Authorities: ${this.authorityOptions.knownAuthorities||f.NOT_APPLICABLE}`),this.logger.verbosePii(`Authority Metadata: ${this.authorityOptions.authorityMetadata||f.NOT_APPLICABLE}`),this.logger.verbosePii(`Canonical Authority: ${e.canonical_authority||f.NOT_APPLICABLE}`);const t=this.getCloudDiscoveryMetadataFromConfig();if(t)return this.logger.verbose("Found cloud discovery metadata in authority configuration"),Ut(e,t,!1),W.CONFIG;if(this.logger.verbose("Did not find cloud discovery metadata in the config... Attempting to get cloud discovery metadata from the hardcoded values."),this.options.skipAuthorityMetadataCache)this.logger.verbose("Skipping hardcoded cloud discovery metadata cache since skipAuthorityMetadataCache is set to true. Attempting to get cloud discovery metadata from the network metadata cache.");else{const a=gn(this.hostnameAndPort);if(a)return this.logger.verbose("Found cloud discovery metadata from hardcoded values."),Ut(e,a,!1),W.HARDCODED_VALUES;this.logger.verbose("Did not find cloud discovery metadata in hardcoded values... Attempting to get cloud discovery metadata from the network metadata cache.")}const i=ua(e);return this.isAuthoritySameType(e)&&e.aliasesFromNetwork&&!i?(this.logger.verbose("Found cloud discovery metadata in the cache."),W.CACHE):(i&&this.logger.verbose("The metadata entity is expired."),null)}getCloudDiscoveryMetadataFromConfig(){if(this.authorityType===te.Ciam)return this.logger.verbose("CIAM authorities do not support cloud discovery metadata, generate the aliases from authority host."),G.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort);if(this.authorityOptions.cloudDiscoveryMetadata){this.logger.verbose("The cloud discovery metadata has been provided as a network response, in the config.");try{this.logger.verbose("Attempting to parse the cloud discovery metadata.");const e=JSON.parse(this.authorityOptions.cloudDiscoveryMetadata),t=Ct(e.metadata,this.hostnameAndPort);if(this.logger.verbose("Parsed the cloud discovery metadata."),t)return this.logger.verbose("There is returnable metadata attached to the parsed cloud discovery metadata."),t;this.logger.verbose("There is no metadata attached to the parsed cloud discovery metadata.")}catch{throw this.logger.verbose("Unable to parse the cloud discovery metadata. Throwing Invalid Cloud Discovery Metadata Error."),O(Ai)}}return this.isInKnownAuthorities()?(this.logger.verbose("The host is included in knownAuthorities. Creating new cloud discovery metadata from the host."),G.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort)):null}async getCloudDiscoveryMetadataFromNetwork(){var a;(a=this.performanceClient)==null||a.addQueueMeasurement(g.AuthorityGetCloudDiscoveryMetadataFromNetwork,this.correlationId);const e=`${f.AAD_INSTANCE_DISCOVERY_ENDPT}${this.canonicalAuthority}oauth2/v2.0/authorize`,t={};let i=null;try{const r=await this.networkInterface.sendGetRequestAsync(e,t);let s,n;if(lo(r.body))s=r.body,n=s.metadata,this.logger.verbosePii(`tenant_discovery_endpoint is: ${s.tenant_discovery_endpoint}`);else if(uo(r.body)){if(this.logger.warning(`A CloudInstanceDiscoveryErrorResponse was returned. The cloud instance discovery network request's status code is: ${r.status}`),s=r.body,s.error===f.INVALID_INSTANCE)return this.logger.error("The CloudInstanceDiscoveryErrorResponse error is invalid_instance."),null;this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error is ${s.error}`),this.logger.warning(`The CloudInstanceDiscoveryErrorResponse error description is ${s.error_description}`),this.logger.warning("Setting the value of the CloudInstanceDiscoveryMetadata (returned from the network) to []"),n=[]}else return this.logger.error("AAD did not return a CloudInstanceDiscoveryResponse or CloudInstanceDiscoveryErrorResponse"),null;this.logger.verbose("Attempting to find a match between the developer's authority and the CloudInstanceDiscoveryMetadata returned from the network request."),i=Ct(n,this.hostnameAndPort)}catch(r){if(r instanceof D)this.logger.error(`There was a network error while attempting to get the cloud discovery instance metadata.
Error: ${r.errorCode}
Error Description: ${r.errorMessage}`);else{const s=r;this.logger.error(`A non-MSALJS error was thrown while attempting to get the cloud instance discovery metadata.
Error: ${s.name}
Error Description: ${s.message}`)}return null}return i||(this.logger.warning("The developer's authority was not found within the CloudInstanceDiscoveryMetadata returned from the network request."),this.logger.verbose("Creating custom Authority for custom domain scenario."),i=G.createCloudDiscoveryMetadataFromHost(this.hostnameAndPort)),i}isInKnownAuthorities(){return this.authorityOptions.knownAuthorities.filter(t=>t&&x.getDomainFromUrl(t).toLowerCase()===this.hostnameAndPort).length>0}static generateAuthority(e,t){let i;if(t&&t.azureCloudInstance!==yi.None){const a=t.tenant?t.tenant:f.DEFAULT_COMMON_TENANT;i=`${t.azureCloudInstance}/${a}/`}return i||e}static createCloudDiscoveryMetadataFromHost(e){return{preferred_network:e,preferred_cache:e,aliases:[e]}}getPreferredCache(){if(this.managedIdentity)return f.DEFAULT_AUTHORITY_HOST;if(this.discoveryComplete())return this.metadata.preferred_cache;throw y(ge)}isAlias(e){return this.metadata.aliases.indexOf(e)>-1}isAliasOfKnownMicrosoftAuthority(e){return Ar.has(e)}static isPublicCloudAuthority(e){return f.KNOWN_PUBLIC_CLOUDS.indexOf(e)>=0}static buildRegionalAuthorityString(e,t,i){const a=new x(e);a.validateAsUri();const r=a.getUrlComponents();let s=`${t}.${r.HostNameAndPort}`;this.isPublicCloudAuthority(r.HostNameAndPort)&&(s=`${t}.${f.REGIONAL_AUTH_PUBLIC_CLOUD_SUFFIX}`);const n=x.constructAuthorityUriFromObject({...a.getUrlComponents(),HostNameAndPort:s}).urlString;return i?`${n}?${i}`:n}static replaceWithRegionalInformation(e,t){const i={...e};return i.authorization_endpoint=G.buildRegionalAuthorityString(i.authorization_endpoint,t),i.token_endpoint=G.buildRegionalAuthorityString(i.token_endpoint,t),i.end_session_endpoint&&(i.end_session_endpoint=G.buildRegionalAuthorityString(i.end_session_endpoint,t)),i}static transformCIAMAuthority(e){let t=e;const a=new x(e).getUrlComponents();if(a.PathSegments.length===0&&a.HostNameAndPort.endsWith(f.CIAM_AUTH_URL)){const r=a.HostNameAndPort.split(".")[0];t=`${t}${r}${f.AAD_TENANT_DOMAIN_SUFFIX}`}return t}}G.reservedTenantDomains=new Set(["{tenant}","{tenantid}",be.COMMON,be.CONSUMERS,be.ORGANIZATIONS]);function po(o){var a;const i=(a=new x(o).getUrlComponents().PathSegments.slice(-1)[0])==null?void 0:a.toLowerCase();switch(i){case be.COMMON:case be.ORGANIZATIONS:case be.CONSUMERS:return;default:return i}}function Sr(o){return o.endsWith(f.FORWARD_SLASH)?o:`${o}${f.FORWARD_SLASH}`}function go(o){const e=o.cloudDiscoveryMetadata;let t;if(e)try{t=JSON.parse(e)}catch{throw O(Ai)}return{canonicalAuthority:o.authority?Sr(o.authority):void 0,knownAuthorities:o.knownAuthorities,cloudDiscoveryMetadata:t}}/*! @azure/msal-common v14.16.1 2025-08-05 */async function Rr(o,e,t,i,a,r,s){s==null||s.addQueueMeasurement(g.AuthorityFactoryCreateDiscoveredInstance,r);const n=G.transformCIAMAuthority(Sr(o)),c=new G(n,e,t,i,a,r,s);try{return await b(c.resolveEndpointsAsync.bind(c),g.AuthorityResolveEndpointsAsync,a,s,r)(),c}catch{throw y(ge)}}/*! @azure/msal-common v14.16.1 2025-08-05 */class we extends D{constructor(e,t,i,a,r){super(e,t,i),this.name="ServerError",this.errorNo=a,this.status=r,Object.setPrototypeOf(this,we.prototype)}}/*! @azure/msal-common v14.16.1 2025-08-05 */class ne{static generateThrottlingStorageKey(e){return`${Je.THROTTLING_PREFIX}.${JSON.stringify(e)}`}static preProcess(e,t,i){var s;const a=ne.generateThrottlingStorageKey(t),r=e.getThrottlingCache(a);if(r){if(r.throttleTime<Date.now()){e.removeItem(a,i);return}throw new we(((s=r.errorCodes)==null?void 0:s.join(" "))||f.EMPTY_STRING,r.errorMessage,r.subError)}}static postProcess(e,t,i,a){if(ne.checkResponseStatus(i)||ne.checkResponseForRetryAfter(i)){const r={throttleTime:ne.calculateThrottleTime(parseInt(i.headers[j.RETRY_AFTER])),error:i.body.error,errorCodes:i.body.error_codes,errorMessage:i.body.error_description,subError:i.body.suberror};e.setThrottlingCache(ne.generateThrottlingStorageKey(t),r,a)}}static checkResponseStatus(e){return e.status===429||e.status>=500&&e.status<600}static checkResponseForRetryAfter(e){return e.headers?e.headers.hasOwnProperty(j.RETRY_AFTER)&&(e.status<200||e.status>=300):!1}static calculateThrottleTime(e){const t=e<=0?0:e,i=Date.now()/1e3;return Math.floor(Math.min(i+(t||Je.DEFAULT_THROTTLE_TIME_SECONDS),i+Je.DEFAULT_MAX_THROTTLE_TIME_SECONDS)*1e3)}static removeThrottle(e,t,i,a){const r={clientId:t,authority:i.authority,scopes:i.scopes,homeAccountIdentifier:a,claims:i.claims,authenticationScheme:i.authenticationScheme,resourceRequestMethod:i.resourceRequestMethod,resourceRequestUri:i.resourceRequestUri,shrClaims:i.shrClaims,sshKid:i.sshKid},s=this.generateThrottlingStorageKey(r);e.removeItem(s,i.correlationId)}}/*! @azure/msal-common v14.16.1 2025-08-05 */class Pt extends D{constructor(e,t,i){super(e.errorCode,e.errorMessage,e.subError),Object.setPrototypeOf(this,Pt.prototype),this.name="NetworkError",this.error=e,this.httpStatus=t,this.responseHeaders=i}}function ya(o,e,t){return new Pt(o,e,t)}/*! @azure/msal-common v14.16.1 2025-08-05 */class Pi{constructor(e,t){this.config=Tn(e),this.logger=new Ce(this.config.loggerOptions,ir,vi),this.cryptoUtils=this.config.cryptoInterface,this.cacheManager=this.config.storageInterface,this.networkClient=this.config.networkInterface,this.serverTelemetryManager=this.config.serverTelemetryManager,this.authority=this.config.authOptions.authority,this.performanceClient=t}createTokenRequestHeaders(e){const t={};if(t[j.CONTENT_TYPE]=f.URL_FORM_CONTENT_TYPE,!this.config.systemOptions.preventCorsPreflight&&e)switch(e.type){case X.HOME_ACCOUNT_ID:try{const i=$e(e.credential);t[j.CCS_HEADER]=`Oid:${i.uid}@${i.utid}`}catch(i){this.logger.verbose("Could not parse home account ID for CCS Header: "+i)}break;case X.UPN:t[j.CCS_HEADER]=`UPN: ${e.credential}`;break}return t}async executePostToTokenEndpoint(e,t,i,a,r,s){var c;s&&((c=this.performanceClient)==null||c.addQueueMeasurement(s,r));const n=await this.sendPostRequest(a,e,{body:t,headers:i},r);return this.config.serverTelemetryManager&&n.status<500&&n.status!==429&&this.config.serverTelemetryManager.clearTelemetryCache(),n}async sendPostRequest(e,t,i,a){var s,n,c;ne.preProcess(this.cacheManager,e,a);let r;try{r=await b(this.networkClient.sendPostRequestAsync.bind(this.networkClient),g.NetworkClientSendPostRequestAsync,this.logger,this.performanceClient,a)(t,i);const l=r.headers||{};(n=this.performanceClient)==null||n.addFields({refreshTokenSize:((s=r.body.refresh_token)==null?void 0:s.length)||0,httpVerToken:l[j.X_MS_HTTP_VERSION]||"",requestId:l[j.X_MS_REQUEST_ID]||""},a)}catch(l){if(l instanceof Pt){const d=l.responseHeaders;throw d&&((c=this.performanceClient)==null||c.addFields({httpVerToken:d[j.X_MS_HTTP_VERSION]||"",requestId:d[j.X_MS_REQUEST_ID]||"",contentTypeHeader:d[j.CONTENT_TYPE]||void 0,contentLengthHeader:d[j.CONTENT_LENGTH]||void 0,httpStatus:l.httpStatus},a)),l.error}throw l instanceof D?l:y(Fa)}return ne.postProcess(this.cacheManager,e,r,a),r}async updateAuthority(e,t){var r;(r=this.performanceClient)==null||r.addQueueMeasurement(g.UpdateTokenEndpointAuthority,t);const i=`https://${e}/${this.authority.tenant}/`,a=await Rr(i,this.networkClient,this.cacheManager,this.authority.options,this.logger,t,this.performanceClient);this.authority=a}createTokenQueryParameters(e){const t=new Qe(e.correlationId,this.performanceClient);return e.embeddedClientId&&t.addBrokerParameters({brokerClientId:this.config.authOptions.clientId,brokerRedirectUri:this.config.authOptions.redirectUri}),e.tokenQueryParameters&&t.addExtraQueryParameters(e.tokenQueryParameters),t.addCorrelationId(e.correlationId),t.createQueryString()}}/*! @azure/msal-common v14.16.1 2025-08-05 */const At="no_tokens_found",xr="native_account_unavailable",_i="refresh_token_expired",mo="interaction_required",fo="consent_required",vo="login_required",_t="bad_token";/*! @azure/msal-common v14.16.1 2025-08-05 */const ba=[mo,fo,vo,_t],yo=["message_only","additional_action","basic_action","user_password_expired","consent_required","bad_token"],bo={[At]:"No refresh token found in the cache. Please sign-in.",[xr]:"The requested account is not available in the native broker. It may have been deleted or logged out. Please sign-in again using an interactive API.",[_i]:"Refresh token has expired.",[_t]:"Identity provider returned bad_token due to an expired or invalid refresh token. Please invoke an interactive API to resolve."};class ee extends D{constructor(e,t,i,a,r,s,n,c){super(e,t,i),Object.setPrototypeOf(this,ee.prototype),this.timestamp=a||f.EMPTY_STRING,this.traceId=r||f.EMPTY_STRING,this.correlationId=s||f.EMPTY_STRING,this.claims=n||f.EMPTY_STRING,this.name="InteractionRequiredAuthError",this.errorNo=c}}function Ca(o,e,t){const i=!!o&&ba.indexOf(o)>-1,a=!!t&&yo.indexOf(t)>-1,r=!!e&&ba.some(s=>e.indexOf(s)>-1);return i||r||a}function Zt(o){return new ee(o,bo[o])}/*! @azure/msal-common v14.16.1 2025-08-05 */class ae{static setRequestState(e,t,i){const a=ae.generateLibraryState(e,i);return t?`${a}${f.RESOURCE_DELIM}${t}`:a}static generateLibraryState(e,t){if(!e)throw y(Yt);const i={id:e.createNewGuid()};t&&(i.meta=t);const a=JSON.stringify(i);return e.base64Encode(a)}static parseRequestState(e,t){if(!e)throw y(Yt);if(!t)throw y(ze);try{const i=t.split(f.RESOURCE_DELIM),a=i[0],r=i.length>1?i.slice(1).join(f.RESOURCE_DELIM):f.EMPTY_STRING,s=e.base64Decode(a),n=JSON.parse(s);return{userRequestState:r||f.EMPTY_STRING,libraryState:n}}catch{throw y(ze)}}}/*! @azure/msal-common v14.16.1 2025-08-05 */const Co={SW:"sw"};class qe{constructor(e,t){this.cryptoUtils=e,this.performanceClient=t}async generateCnf(e,t){var r;(r=this.performanceClient)==null||r.addQueueMeasurement(g.PopTokenGenerateCnf,e.correlationId);const i=await b(this.generateKid.bind(this),g.PopTokenGenerateCnf,t,this.performanceClient,e.correlationId)(e),a=this.cryptoUtils.base64UrlEncode(JSON.stringify(i));return{kid:i.kid,reqCnfString:a}}async generateKid(e){var i;return(i=this.performanceClient)==null||i.addQueueMeasurement(g.PopTokenGenerateKid,e.correlationId),{kid:await this.cryptoUtils.getPublicKeyThumbprint(e),xms_ksl:Co.SW}}async signPopToken(e,t,i){return this.signPayload(e,t,i)}async signPayload(e,t,i,a){const{resourceRequestMethod:r,resourceRequestUri:s,shrClaims:n,shrNonce:c,shrOptions:l}=i,d=s?new x(s):void 0,u=d==null?void 0:d.getUrlComponents();return this.cryptoUtils.signJwt({at:e,ts:de(),m:r==null?void 0:r.toUpperCase(),u:u==null?void 0:u.HostNameAndPort,nonce:c||this.cryptoUtils.createNewGuid(),p:u==null?void 0:u.AbsolutePath,q:u!=null&&u.QueryString?[[],u.QueryString]:void 0,client_claims:n||void 0,...a},t,l,i.correlationId)}}/*! @azure/msal-common v14.16.1 2025-08-05 */class wo{constructor(e,t){this.cache=e,this.hasChanged=t}get cacheHasChanged(){return this.hasChanged}get tokenCache(){return this.cache}}/*! @azure/msal-common v14.16.1 2025-08-05 */function Ao(o){var i,a;const e="code=",t=(i=o.error_uri)==null?void 0:i.lastIndexOf(e);return t&&t>=0?(a=o.error_uri)==null?void 0:a.substring(t+e.length):void 0}class Ie{constructor(e,t,i,a,r,s,n){this.clientId=e,this.cacheStorage=t,this.cryptoObj=i,this.logger=a,this.serializableCache=r,this.persistencePlugin=s,this.performanceClient=n}validateServerAuthorizationCodeResponse(e,t){if(!e.state||!t)throw e.state?y(mt,"Cached State"):y(mt,"Server State");let i,a;try{i=decodeURIComponent(e.state)}catch{throw y(ze,e.state)}try{a=decodeURIComponent(t)}catch{throw y(ze,e.state)}if(i!==a)throw y(Ka);if(e.error||e.error_description||e.suberror){const r=Ao(e);throw Ca(e.error,e.error_description,e.suberror)?new ee(e.error||"",e.error_description,e.suberror,e.timestamp||"",e.trace_id||"",e.correlation_id||"",e.claims||"",r):new we(e.error||"",e.error_description,e.suberror,r)}}validateTokenResponse(e,t){var i;if(e.error||e.error_description||e.suberror){const a=`Error(s): ${e.error_codes||f.NOT_AVAILABLE} - Timestamp: ${e.timestamp||f.NOT_AVAILABLE} - Description: ${e.error_description||f.NOT_AVAILABLE} - Correlation ID: ${e.correlation_id||f.NOT_AVAILABLE} - Trace ID: ${e.trace_id||f.NOT_AVAILABLE}`,r=(i=e.error_codes)!=null&&i.length?e.error_codes[0]:void 0,s=new we(e.error,a,e.suberror,r,e.status);if(t&&e.status&&e.status>=rt.SERVER_ERROR_RANGE_START&&e.status<=rt.SERVER_ERROR_RANGE_END){this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently unavailable and the access token is unable to be refreshed.
${s}`);return}else if(t&&e.status&&e.status>=rt.CLIENT_ERROR_RANGE_START&&e.status<=rt.CLIENT_ERROR_RANGE_END){this.logger.warning(`executeTokenRequest:validateTokenResponse - AAD is currently available but is unable to refresh the access token.
${s}`);return}throw Ca(e.error,e.error_description,e.suberror)?new ee(e.error,e.error_description,e.suberror,e.timestamp||f.EMPTY_STRING,e.trace_id||f.EMPTY_STRING,e.correlation_id||f.EMPTY_STRING,e.claims||f.EMPTY_STRING,r):s}}async handleServerTokenResponse(e,t,i,a,r,s,n,c,l){var m;(m=this.performanceClient)==null||m.addQueueMeasurement(g.HandleServerTokenResponse,e.correlation_id);let d;if(e.id_token){if(d=Se(e.id_token||f.EMPTY_STRING,this.cryptoObj.base64Decode),r&&r.nonce&&d.nonce!==r.nonce)throw y(ja);if(a.maxAge||a.maxAge===0){const v=d.auth_time;if(!v)throw y(pi);ar(v,a.maxAge)}}this.homeAccountIdentifier=z.generateHomeAccountId(e.client_info||f.EMPTY_STRING,t.authorityType,this.logger,this.cryptoObj,d);let u;r&&r.state&&(u=ae.parseRequestState(this.cryptoObj,r.state)),e.key_id=e.key_id||a.sshKid||void 0;const p=this.generateCacheRecord(e,t,i,a,d,s,r);let h;try{if(this.persistencePlugin&&this.serializableCache&&(this.logger.verbose("Persistence enabled, calling beforeCacheAccess"),h=new wo(this.serializableCache,!0),await this.persistencePlugin.beforeCacheAccess(h)),n&&!c&&p.account){const v=p.account.generateAccountKey();if(!this.cacheStorage.getAccount(v,a.correlationId,this.logger))return this.logger.warning("Account used to refresh tokens not in persistence, refreshed tokens will not be stored in the cache"),await Ie.generateAuthenticationResult(this.cryptoObj,t,p,!1,a,d,u,void 0,l)}await this.cacheStorage.saveCacheRecord(p,a.correlationId,a.storeInCache)}finally{this.persistencePlugin&&this.serializableCache&&h&&(this.logger.verbose("Persistence enabled, calling afterCacheAccess"),await this.persistencePlugin.afterCacheAccess(h))}return Ie.generateAuthenticationResult(this.cryptoObj,t,p,!1,a,d,u,e,l)}generateCacheRecord(e,t,i,a,r,s,n){const c=t.getPreferredCache();if(!c)throw y(mi);const l=br(r);let d,u;e.id_token&&r&&(d=Et(this.homeAccountIdentifier,c,e.id_token,this.clientId,l||""),u=Mi(this.cacheStorage,t,this.homeAccountIdentifier,this.cryptoObj.base64Decode,a.correlationId,r,e.client_info,c,l,n,void 0,this.logger));let p=null;if(e.access_token){const v=e.scope?U.fromString(e.scope):new U(a.scopes||[]),w=(typeof e.expires_in=="string"?parseInt(e.expires_in,10):e.expires_in)||0,C=(typeof e.ext_expires_in=="string"?parseInt(e.ext_expires_in,10):e.ext_expires_in)||0,T=(typeof e.refresh_in=="string"?parseInt(e.refresh_in,10):e.refresh_in)||void 0,P=i+w,he=P+C,xe=T&&T>0?i+T:void 0;p=St(this.homeAccountIdentifier,c,e.access_token,this.clientId,l||t.tenant||"",v.printScopes(),P,he,this.cryptoObj.base64Decode,xe,e.token_type,s,e.key_id,a.claims,a.requestedClaimsHash)}let h=null;if(e.refresh_token){let v;if(e.refresh_token_expires_in){const w=typeof e.refresh_token_expires_in=="string"?parseInt(e.refresh_token_expires_in,10):e.refresh_token_expires_in;v=i+w}h=rr(this.homeAccountIdentifier,c,e.refresh_token,this.clientId,e.foci,s,v)}let m=null;return e.foci&&(m={clientId:this.clientId,environment:c,familyId:e.foci}),{account:u,idToken:d,accessToken:p,refreshToken:h,appMetadata:m}}static async generateAuthenticationResult(e,t,i,a,r,s,n,c,l){var P,he,xe,Qi,Xi;let d=f.EMPTY_STRING,u=[],p=null,h,m,v=f.EMPTY_STRING;if(i.accessToken){if(i.accessToken.tokenType===M.POP&&!r.popKid){const Rs=new qe(e),{secret:xs,keyId:Zi}=i.accessToken;if(!Zi)throw y(fi);d=await Rs.signPopToken(xs,Zi,r)}else d=i.accessToken.secret;u=U.fromString(i.accessToken.target).asArray(),p=new Date(Number(i.accessToken.expiresOn)*1e3),h=new Date(Number(i.accessToken.extendedExpiresOn)*1e3),i.accessToken.refreshOn&&(m=new Date(Number(i.accessToken.refreshOn)*1e3))}i.appMetadata&&(v=i.appMetadata.familyId===We?We:"");const w=(s==null?void 0:s.oid)||(s==null?void 0:s.sub)||"",C=(s==null?void 0:s.tid)||"";c!=null&&c.spa_accountid&&i.account&&(i.account.nativeAccountId=c==null?void 0:c.spa_accountid);const T=i.account?ki(i.account.getAccountInfo(),void 0,s,(P=i.idToken)==null?void 0:P.secret):null;return{authority:t.canonicalAuthority,uniqueId:w,tenantId:C,scopes:u,account:T,idToken:((he=i==null?void 0:i.idToken)==null?void 0:he.secret)||"",idTokenClaims:s||{},accessToken:d,fromCache:a,expiresOn:p,extExpiresOn:h,refreshOn:m,correlationId:r.correlationId,requestId:l||f.EMPTY_STRING,familyId:v,tokenType:((xe=i.accessToken)==null?void 0:xe.tokenType)||f.EMPTY_STRING,state:n?n.userRequestState:f.EMPTY_STRING,cloudGraphHostName:((Qi=i.account)==null?void 0:Qi.cloudGraphHostName)||f.EMPTY_STRING,msGraphHost:((Xi=i.account)==null?void 0:Xi.msGraphHost)||f.EMPTY_STRING,code:c==null?void 0:c.spa_code,fromNativeBroker:!1}}}function Mi(o,e,t,i,a,r,s,n,c,l,d,u){u==null||u.verbose("setCachedAccount called");const h=o.getAccountKeys().find(T=>T.startsWith(t));let m=null;h&&(m=o.getAccount(h,a,u));const v=m||z.createAccount({homeAccountId:t,idTokenClaims:r,clientInfo:s,environment:n,cloudGraphHostName:l==null?void 0:l.cloud_graph_host_name,msGraphHost:l==null?void 0:l.msgraph_host,nativeAccountId:d},e,i),w=v.tenantProfiles||[],C=c||v.realm;if(C&&!w.find(T=>T.tenantId===C)){const T=Ii(t,v.localAccountId,C,r);w.push(T)}return v.tenantProfiles=w,v}/*! @azure/msal-common v14.16.1 2025-08-05 */async function Pr(o,e,t){return typeof o=="string"?o:o({clientId:e,tokenEndpoint:t})}/*! @azure/msal-common v14.16.1 2025-08-05 */class _r extends Pi{constructor(e,t){var i;super(e,t),this.includeRedirectUri=!0,this.oidcDefaultScopes=(i=this.config.authOptions.authority.options.OIDCOptions)==null?void 0:i.defaultScopes}async getAuthCodeUrl(e){var i;(i=this.performanceClient)==null||i.addQueueMeasurement(g.GetAuthCodeUrl,e.correlationId);const t=await b(this.createAuthCodeUrlQueryString.bind(this),g.AuthClientCreateQueryString,this.logger,this.performanceClient,e.correlationId)(e);return x.appendQueryString(this.authority.authorizationEndpoint,t)}async acquireToken(e,t){var n,c;if((n=this.performanceClient)==null||n.addQueueMeasurement(g.AuthClientAcquireToken,e.correlationId),!e.code)throw y(Wa);const i=de(),a=await b(this.executeTokenRequest.bind(this),g.AuthClientExecuteTokenRequest,this.logger,this.performanceClient,e.correlationId)(this.authority,e),r=(c=a.headers)==null?void 0:c[j.X_MS_REQUEST_ID],s=new Ie(this.config.authOptions.clientId,this.cacheManager,this.cryptoUtils,this.logger,this.config.serializableCache,this.config.persistencePlugin,this.performanceClient);return s.validateTokenResponse(a.body),b(s.handleServerTokenResponse.bind(s),g.HandleServerTokenResponse,this.logger,this.performanceClient,e.correlationId)(a.body,this.authority,i,e,t,void 0,void 0,void 0,r)}handleFragmentResponse(e,t){if(new Ie(this.config.authOptions.clientId,this.cacheManager,this.cryptoUtils,this.logger,null,null).validateServerAuthorizationCodeResponse(e,t),!e.code)throw y(er);return e}getLogoutUri(e){if(!e)throw O(ur);const t=this.createLogoutUrlQueryString(e);return x.appendQueryString(this.authority.endSessionEndpoint,t)}async executeTokenRequest(e,t){var l,d;(l=this.performanceClient)==null||l.addQueueMeasurement(g.AuthClientExecuteTokenRequest,t.correlationId);const i=this.createTokenQueryParameters(t),a=x.appendQueryString(e.tokenEndpoint,i),r=await b(this.createTokenRequestBody.bind(this),g.AuthClientCreateTokenRequestBody,this.logger,this.performanceClient,t.correlationId)(t);let s;if(t.clientInfo)try{const u=vt(t.clientInfo,this.cryptoUtils.base64Decode);s={credential:`${u.uid}${K.CLIENT_INFO_SEPARATOR}${u.utid}`,type:X.HOME_ACCOUNT_ID}}catch(u){this.logger.verbose("Could not parse client info for CCS Header: "+u)}const n=this.createTokenRequestHeaders(s||t.ccsCredential),c={clientId:((d=t.tokenBodyParameters)==null?void 0:d.clientId)||this.config.authOptions.clientId,authority:e.canonicalAuthority,scopes:t.scopes,claims:t.claims,authenticationScheme:t.authenticationScheme,resourceRequestMethod:t.resourceRequestMethod,resourceRequestUri:t.resourceRequestUri,shrClaims:t.shrClaims,sshKid:t.sshKid};return b(this.executePostToTokenEndpoint.bind(this),g.AuthorizationCodeClientExecutePostToTokenEndpoint,this.logger,this.performanceClient,t.correlationId)(a,r,n,c,t.correlationId,g.AuthorizationCodeClientExecutePostToTokenEndpoint)}async createTokenRequestBody(e){var a,r;(a=this.performanceClient)==null||a.addQueueMeasurement(g.AuthClientCreateTokenRequestBody,e.correlationId);const t=new Qe(e.correlationId,this.performanceClient);if(t.addClientId(e.embeddedClientId||((r=e.tokenBodyParameters)==null?void 0:r[Te])||this.config.authOptions.clientId),this.includeRedirectUri?t.addRedirectUri(e.redirectUri):_e.validateRedirectUri(e.redirectUri),t.addScopes(e.scopes,!0,this.oidcDefaultScopes),t.addAuthorizationCode(e.code),t.addLibraryInfo(this.config.libraryInfo),t.addApplicationTelemetry(this.config.telemetry.application),t.addThrottling(),this.serverTelemetryManager&&!Qt(this.config)&&t.addServerTelemetry(this.serverTelemetryManager),e.codeVerifier&&t.addCodeVerifier(e.codeVerifier),this.config.clientCredentials.clientSecret&&t.addClientSecret(this.config.clientCredentials.clientSecret),this.config.clientCredentials.clientAssertion){const s=this.config.clientCredentials.clientAssertion;t.addClientAssertion(await Pr(s.assertion,this.config.authOptions.clientId,e.resourceRequestUri)),t.addClientAssertionType(s.assertionType)}if(t.addGrantType(Ha.AUTHORIZATION_CODE_GRANT),t.addClientInfo(),e.authenticationScheme===M.POP){const s=new qe(this.cryptoUtils,this.performanceClient);let n;e.popKid?n=this.cryptoUtils.encodeKid(e.popKid):n=(await b(s.generateCnf.bind(s),g.PopTokenGenerateCnf,this.logger,this.performanceClient,e.correlationId)(e,this.logger)).reqCnfString,t.addPopToken(n)}else if(e.authenticationScheme===M.SSH)if(e.sshJwk)t.addSshJwk(e.sshJwk);else throw O(Rt);(!ie.isEmptyObj(e.claims)||this.config.authOptions.clientCapabilities&&this.config.authOptions.clientCapabilities.length>0)&&t.addClaims(e.claims,this.config.authOptions.clientCapabilities);let i;if(e.clientInfo)try{const s=vt(e.clientInfo,this.cryptoUtils.base64Decode);i={credential:`${s.uid}${K.CLIENT_INFO_SEPARATOR}${s.utid}`,type:X.HOME_ACCOUNT_ID}}catch(s){this.logger.verbose("Could not parse client info for CCS Header: "+s)}else i=e.ccsCredential;if(this.config.systemOptions.preventCorsPreflight&&i)switch(i.type){case X.HOME_ACCOUNT_ID:try{const s=$e(i.credential);t.addCcsOid(s)}catch(s){this.logger.verbose("Could not parse home account ID for CCS Header: "+s)}break;case X.UPN:t.addCcsUpn(i.credential);break}return e.embeddedClientId&&t.addBrokerParameters({brokerClientId:this.config.authOptions.clientId,brokerRedirectUri:this.config.authOptions.redirectUri}),e.tokenBodyParameters&&t.addExtraQueryParameters(e.tokenBodyParameters),e.enableSpaAuthorizationCode&&(!e.tokenBodyParameters||!e.tokenBodyParameters[va])&&t.addExtraQueryParameters({[va]:"1"}),t.createQueryString()}async createAuthCodeUrlQueryString(e){var r,s;const t=e.correlationId||this.config.cryptoInterface.createNewGuid();(r=this.performanceClient)==null||r.addQueueMeasurement(g.AuthClientCreateQueryString,t);const i=new Qe(t,this.performanceClient);i.addClientId(e.embeddedClientId||((s=e.extraQueryParameters)==null?void 0:s[Te])||this.config.authOptions.clientId);const a=[...e.scopes||[],...e.extraScopesToConsent||[]];if(i.addScopes(a,!0,this.oidcDefaultScopes),i.addRedirectUri(e.redirectUri),i.addCorrelationId(t),i.addResponseMode(e.responseMode),i.addResponseTypeCode(),i.addLibraryInfo(this.config.libraryInfo),Qt(this.config)||i.addApplicationTelemetry(this.config.telemetry.application),i.addClientInfo(),e.codeChallenge&&e.codeChallengeMethod&&i.addCodeChallengeParams(e.codeChallenge,e.codeChallengeMethod),e.prompt&&i.addPrompt(e.prompt),e.domainHint&&i.addDomainHint(e.domainHint),e.prompt!==F.SELECT_ACCOUNT)if(e.sid&&e.prompt===F.NONE)this.logger.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from request"),i.addSid(e.sid);else if(e.account){const n=this.extractAccountSid(e.account);let c=this.extractLoginHint(e.account);if(c&&e.domainHint&&(this.logger.warning('AuthorizationCodeClient.createAuthCodeUrlQueryString: "domainHint" param is set, skipping opaque "login_hint" claim. Please consider not passing domainHint'),c=null),c){this.logger.verbose("createAuthCodeUrlQueryString: login_hint claim present on account"),i.addLoginHint(c);try{const l=$e(e.account.homeAccountId);i.addCcsOid(l)}catch{this.logger.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")}}else if(n&&e.prompt===F.NONE){this.logger.verbose("createAuthCodeUrlQueryString: Prompt is none, adding sid from account"),i.addSid(n);try{const l=$e(e.account.homeAccountId);i.addCcsOid(l)}catch{this.logger.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")}}else if(e.loginHint)this.logger.verbose("createAuthCodeUrlQueryString: Adding login_hint from request"),i.addLoginHint(e.loginHint),i.addCcsUpn(e.loginHint);else if(e.account.username){this.logger.verbose("createAuthCodeUrlQueryString: Adding login_hint from account"),i.addLoginHint(e.account.username);try{const l=$e(e.account.homeAccountId);i.addCcsOid(l)}catch{this.logger.verbose("createAuthCodeUrlQueryString: Could not parse home account ID for CCS Header")}}}else e.loginHint&&(this.logger.verbose("createAuthCodeUrlQueryString: No account, adding login_hint from request"),i.addLoginHint(e.loginHint),i.addCcsUpn(e.loginHint));else this.logger.verbose("createAuthCodeUrlQueryString: Prompt is select_account, ignoring account hints");if(e.nonce&&i.addNonce(e.nonce),e.state&&i.addState(e.state),(e.claims||this.config.authOptions.clientCapabilities&&this.config.authOptions.clientCapabilities.length>0)&&i.addClaims(e.claims,this.config.authOptions.clientCapabilities),e.embeddedClientId&&i.addBrokerParameters({brokerClientId:this.config.authOptions.clientId,brokerRedirectUri:this.config.authOptions.redirectUri}),this.addExtraQueryParams(e,i),e.nativeBroker&&(i.addNativeBroker(),e.authenticationScheme===M.POP)){const n=new qe(this.cryptoUtils);let c;e.popKid?c=this.cryptoUtils.encodeKid(e.popKid):c=(await b(n.generateCnf.bind(n),g.PopTokenGenerateCnf,this.logger,this.performanceClient,e.correlationId)(e,this.logger)).reqCnfString,i.addPopToken(c)}return i.createQueryString()}createLogoutUrlQueryString(e){const t=new Qe(e.correlationId,this.performanceClient);return e.postLogoutRedirectUri&&t.addPostLogoutRedirectUri(e.postLogoutRedirectUri),e.correlationId&&t.addCorrelationId(e.correlationId),e.idTokenHint&&t.addIdTokenHint(e.idTokenHint),e.state&&t.addState(e.state),e.logoutHint&&t.addLogoutHint(e.logoutHint),this.addExtraQueryParams(e,t),t.createQueryString()}addExtraQueryParams(e,t){!(e.extraQueryParameters&&e.extraQueryParameters.hasOwnProperty("instance_aware"))&&this.config.authOptions.instanceAware&&(e.extraQueryParameters=e.extraQueryParameters||{},e.extraQueryParameters.instance_aware="true"),e.extraQueryParameters&&t.addExtraQueryParameters(e.extraQueryParameters)}extractAccountSid(e){var t;return((t=e.idTokenClaims)==null?void 0:t.sid)||null}extractLoginHint(e){var t;return((t=e.idTokenClaims)==null?void 0:t.login_hint)||null}}/*! @azure/msal-common v14.16.1 2025-08-05 */const To=300;class ei extends Pi{constructor(e,t){super(e,t)}async acquireToken(e){var s,n;(s=this.performanceClient)==null||s.addQueueMeasurement(g.RefreshTokenClientAcquireToken,e.correlationId);const t=de(),i=await b(this.executeTokenRequest.bind(this),g.RefreshTokenClientExecuteTokenRequest,this.logger,this.performanceClient,e.correlationId)(e,this.authority),a=(n=i.headers)==null?void 0:n[j.X_MS_REQUEST_ID],r=new Ie(this.config.authOptions.clientId,this.cacheManager,this.cryptoUtils,this.logger,this.config.serializableCache,this.config.persistencePlugin);return r.validateTokenResponse(i.body),b(r.handleServerTokenResponse.bind(r),g.HandleServerTokenResponse,this.logger,this.performanceClient,e.correlationId)(i.body,this.authority,t,e,void 0,void 0,!0,e.forceCache,a)}async acquireTokenByRefreshToken(e){var i;if(!e)throw O(dr);if((i=this.performanceClient)==null||i.addQueueMeasurement(g.RefreshTokenClientAcquireTokenByRefreshToken,e.correlationId),!e.account)throw y(gi);if(this.cacheManager.isAppMetadataFOCI(e.account.environment))try{return await b(this.acquireTokenWithCachedRefreshToken.bind(this),g.RefreshTokenClientAcquireTokenWithCachedRefreshToken,this.logger,this.performanceClient,e.correlationId)(e,!0)}catch(a){const r=a instanceof ee&&a.errorCode===At,s=a instanceof we&&a.errorCode===aa.INVALID_GRANT_ERROR&&a.subError===aa.CLIENT_MISMATCH_ERROR;if(r||s)return b(this.acquireTokenWithCachedRefreshToken.bind(this),g.RefreshTokenClientAcquireTokenWithCachedRefreshToken,this.logger,this.performanceClient,e.correlationId)(e,!1);throw a}return b(this.acquireTokenWithCachedRefreshToken.bind(this),g.RefreshTokenClientAcquireTokenWithCachedRefreshToken,this.logger,this.performanceClient,e.correlationId)(e,!1)}async acquireTokenWithCachedRefreshToken(e,t){var r;(r=this.performanceClient)==null||r.addQueueMeasurement(g.RefreshTokenClientAcquireTokenWithCachedRefreshToken,e.correlationId);const i=Re(this.cacheManager.getRefreshToken.bind(this.cacheManager),g.CacheManagerGetRefreshToken,this.logger,this.performanceClient,e.correlationId)(e.account,t,e.correlationId,void 0,this.performanceClient);if(!i)throw Zt(At);if(i.expiresOn&&Jt(i.expiresOn,e.refreshTokenExpirationOffsetSeconds||To))throw Zt(_i);const a={...e,refreshToken:i.secret,authenticationScheme:e.authenticationScheme||M.BEARER,ccsCredential:{credential:e.account.homeAccountId,type:X.HOME_ACCOUNT_ID}};try{return await b(this.acquireToken.bind(this),g.RefreshTokenClientAcquireToken,this.logger,this.performanceClient,e.correlationId)(a)}catch(s){if(s instanceof ee&&s.subError===_t){this.logger.verbose("acquireTokenWithRefreshToken: bad refresh token, removing from cache");const n=Oe(i);this.cacheManager.removeRefreshToken(n,e.correlationId)}throw s}}async executeTokenRequest(e,t){var c,l;(c=this.performanceClient)==null||c.addQueueMeasurement(g.RefreshTokenClientExecuteTokenRequest,e.correlationId);const i=this.createTokenQueryParameters(e),a=x.appendQueryString(t.tokenEndpoint,i),r=await b(this.createTokenRequestBody.bind(this),g.RefreshTokenClientCreateTokenRequestBody,this.logger,this.performanceClient,e.correlationId)(e),s=this.createTokenRequestHeaders(e.ccsCredential),n={clientId:((l=e.tokenBodyParameters)==null?void 0:l.clientId)||this.config.authOptions.clientId,authority:t.canonicalAuthority,scopes:e.scopes,claims:e.claims,authenticationScheme:e.authenticationScheme,resourceRequestMethod:e.resourceRequestMethod,resourceRequestUri:e.resourceRequestUri,shrClaims:e.shrClaims,sshKid:e.sshKid};return b(this.executePostToTokenEndpoint.bind(this),g.RefreshTokenClientExecutePostToTokenEndpoint,this.logger,this.performanceClient,e.correlationId)(a,r,s,n,e.correlationId,g.RefreshTokenClientExecutePostToTokenEndpoint)}async createTokenRequestBody(e){var a,r,s;(a=this.performanceClient)==null||a.addQueueMeasurement(g.RefreshTokenClientCreateTokenRequestBody,e.correlationId);const t=e.correlationId,i=new Qe(t,this.performanceClient);if(i.addClientId(e.embeddedClientId||((r=e.tokenBodyParameters)==null?void 0:r[Te])||this.config.authOptions.clientId),e.redirectUri&&i.addRedirectUri(e.redirectUri),i.addScopes(e.scopes,!0,(s=this.config.authOptions.authority.options.OIDCOptions)==null?void 0:s.defaultScopes),i.addGrantType(Ha.REFRESH_TOKEN_GRANT),i.addClientInfo(),i.addLibraryInfo(this.config.libraryInfo),i.addApplicationTelemetry(this.config.telemetry.application),i.addThrottling(),this.serverTelemetryManager&&!Qt(this.config)&&i.addServerTelemetry(this.serverTelemetryManager),i.addRefreshToken(e.refreshToken),this.config.clientCredentials.clientSecret&&i.addClientSecret(this.config.clientCredentials.clientSecret),this.config.clientCredentials.clientAssertion){const n=this.config.clientCredentials.clientAssertion;i.addClientAssertion(await Pr(n.assertion,this.config.authOptions.clientId,e.resourceRequestUri)),i.addClientAssertionType(n.assertionType)}if(e.authenticationScheme===M.POP){const n=new qe(this.cryptoUtils,this.performanceClient);let c;e.popKid?c=this.cryptoUtils.encodeKid(e.popKid):c=(await b(n.generateCnf.bind(n),g.PopTokenGenerateCnf,this.logger,this.performanceClient,e.correlationId)(e,this.logger)).reqCnfString,i.addPopToken(c)}else if(e.authenticationScheme===M.SSH)if(e.sshJwk)i.addSshJwk(e.sshJwk);else throw O(Rt);if((!ie.isEmptyObj(e.claims)||this.config.authOptions.clientCapabilities&&this.config.authOptions.clientCapabilities.length>0)&&i.addClaims(e.claims,this.config.authOptions.clientCapabilities),this.config.systemOptions.preventCorsPreflight&&e.ccsCredential)switch(e.ccsCredential.type){case X.HOME_ACCOUNT_ID:try{const n=$e(e.ccsCredential.credential);i.addCcsOid(n)}catch(n){this.logger.verbose("Could not parse home account ID for CCS Header: "+n)}break;case X.UPN:i.addCcsUpn(e.ccsCredential.credential);break}return e.embeddedClientId&&i.addBrokerParameters({brokerClientId:this.config.authOptions.clientId,brokerRedirectUri:this.config.authOptions.redirectUri}),e.tokenBodyParameters&&i.addExtraQueryParameters(e.tokenBodyParameters),i.createQueryString()}}/*! @azure/msal-common v14.16.1 2025-08-05 */class Io extends Pi{constructor(e,t){super(e,t)}async acquireToken(e){var t;try{const[i,a]=await this.acquireCachedToken({...e,scopes:(t=e.scopes)!=null&&t.length?e.scopes:[...Ge]});return a===ye.PROACTIVELY_REFRESHED&&(this.logger.info("SilentFlowClient:acquireCachedToken - Cached access token's refreshOn property has been exceeded'. It's not expired, but must be refreshed."),new ei(this.config,this.performanceClient).acquireTokenByRefreshToken(e).catch(()=>{})),i}catch(i){if(i instanceof kt&&i.errorCode===me)return new ei(this.config,this.performanceClient).acquireTokenByRefreshToken(e);throw i}}async acquireCachedToken(e){var c;(c=this.performanceClient)==null||c.addQueueMeasurement(g.SilentFlowClientAcquireCachedToken,e.correlationId);let t=ye.NOT_APPLICABLE;if(e.forceRefresh||!this.config.cacheOptions.claimsBasedCachingEnabled&&!ie.isEmptyObj(e.claims))throw this.setCacheOutcome(ye.FORCE_REFRESH_OR_CLAIMS,e.correlationId),y(me);if(!e.account)throw y(gi);const i=e.account.tenantId||po(e.authority),a=this.cacheManager.getTokenKeys(),r=this.cacheManager.getAccessToken(e.account,e,a,i,this.performanceClient);if(r){if(Qs(r.cachedAt)||Jt(r.expiresOn,this.config.systemOptions.tokenRenewalOffsetSeconds))throw this.setCacheOutcome(ye.CACHED_ACCESS_TOKEN_EXPIRED,e.correlationId),y(me);r.refreshOn&&Jt(r.refreshOn,0)&&(t=ye.PROACTIVELY_REFRESHED)}else throw this.setCacheOutcome(ye.NO_CACHED_ACCESS_TOKEN,e.correlationId),y(me);const s=e.authority||this.authority.getPreferredCache(),n={account:this.cacheManager.readAccountFromCache(e.account,e.correlationId),accessToken:r,idToken:this.cacheManager.getIdToken(e.account,e.correlationId,a,i,this.performanceClient),refreshToken:null,appMetadata:this.cacheManager.readAppMetadataFromCache(s)};return this.setCacheOutcome(t,e.correlationId),this.config.serverTelemetryManager&&this.config.serverTelemetryManager.incrementCacheHits(),[await b(this.generateResultFromCacheRecord.bind(this),g.SilentFlowClientGenerateResultFromCacheRecord,this.logger,this.performanceClient,e.correlationId)(n,e),t]}setCacheOutcome(e,t){var i,a;(i=this.serverTelemetryManager)==null||i.setCacheOutcome(e),(a=this.performanceClient)==null||a.addFields({cacheOutcome:e},t),e!==ye.NOT_APPLICABLE&&this.logger.info(`Token refresh is required due to cache outcome: ${e}`)}async generateResultFromCacheRecord(e,t){var a;(a=this.performanceClient)==null||a.addQueueMeasurement(g.SilentFlowClientGenerateResultFromCacheRecord,t.correlationId);let i;if(e.idToken&&(i=Se(e.idToken.secret,this.config.cryptoInterface.base64Decode)),t.maxAge||t.maxAge===0){const r=i==null?void 0:i.auth_time;if(!r)throw y(pi);ar(r,t.maxAge)}return Ie.generateAuthenticationResult(this.cryptoUtils,this.authority,e,!0,t,i)}}/*! @azure/msal-common v14.16.1 2025-08-05 */const ko={sendGetRequestAsync:()=>Promise.reject(y(R)),sendPostRequestAsync:()=>Promise.reject(y(R))};/*! @azure/msal-common v14.16.1 2025-08-05 */const wa=",",Mr="|";function Eo(o){const{skus:e,libraryName:t,libraryVersion:i,extensionName:a,extensionVersion:r}=o,s=new Map([[0,[t,i]],[2,[a,r]]]);let n=[];if(e!=null&&e.length){if(n=e.split(wa),n.length<4)return e}else n=Array.from({length:4},()=>Mr);return s.forEach((c,l)=>{var d,u;c.length===2&&((d=c[0])!=null&&d.length)&&((u=c[1])!=null&&u.length)&&So({skuArr:n,index:l,skuName:c[0],skuVersion:c[1]})}),n.join(wa)}function So(o){const{skuArr:e,index:t,skuName:i,skuVersion:a}=o;t>=e.length||(e[t]=[i,a].join(Mr))}class et{constructor(e,t){this.cacheOutcome=ye.NOT_APPLICABLE,this.cacheManager=t,this.apiId=e.apiId,this.correlationId=e.correlationId,this.wrapperSKU=e.wrapperSKU||f.EMPTY_STRING,this.wrapperVer=e.wrapperVer||f.EMPTY_STRING,this.telemetryCacheKey=B.CACHE_KEY+K.CACHE_KEY_SEPARATOR+e.clientId}generateCurrentRequestHeaderValue(){const e=`${this.apiId}${B.VALUE_SEPARATOR}${this.cacheOutcome}`,t=[this.wrapperSKU,this.wrapperVer],i=this.getNativeBrokerErrorCode();i!=null&&i.length&&t.push(`broker_error=${i}`);const a=t.join(B.VALUE_SEPARATOR),r=this.getRegionDiscoveryFields(),s=[e,r].join(B.VALUE_SEPARATOR);return[B.SCHEMA_VERSION,s,a].join(B.CATEGORY_SEPARATOR)}generateLastRequestHeaderValue(){const e=this.getLastRequests(),t=et.maxErrorsToSend(e),i=e.failedRequests.slice(0,2*t).join(B.VALUE_SEPARATOR),a=e.errors.slice(0,t).join(B.VALUE_SEPARATOR),r=e.errors.length,s=t<r?B.OVERFLOW_TRUE:B.OVERFLOW_FALSE,n=[r,s].join(B.VALUE_SEPARATOR);return[B.SCHEMA_VERSION,e.cacheHits,i,a,n].join(B.CATEGORY_SEPARATOR)}cacheFailedRequest(e){const t=this.getLastRequests();t.errors.length>=B.MAX_CACHED_ERRORS&&(t.failedRequests.shift(),t.failedRequests.shift(),t.errors.shift()),t.failedRequests.push(this.apiId,this.correlationId),e instanceof Error&&e&&e.toString()?e instanceof D?e.subError?t.errors.push(e.subError):e.errorCode?t.errors.push(e.errorCode):t.errors.push(e.toString()):t.errors.push(e.toString()):t.errors.push(B.UNKNOWN_ERROR),this.cacheManager.setServerTelemetry(this.telemetryCacheKey,t,this.correlationId)}incrementCacheHits(){const e=this.getLastRequests();return e.cacheHits+=1,this.cacheManager.setServerTelemetry(this.telemetryCacheKey,e,this.correlationId),e.cacheHits}getLastRequests(){const e={failedRequests:[],errors:[],cacheHits:0};return this.cacheManager.getServerTelemetry(this.telemetryCacheKey)||e}clearTelemetryCache(){const e=this.getLastRequests(),t=et.maxErrorsToSend(e),i=e.errors.length;if(t===i)this.cacheManager.removeItem(this.telemetryCacheKey,this.correlationId);else{const a={failedRequests:e.failedRequests.slice(t*2),errors:e.errors.slice(t),cacheHits:0};this.cacheManager.setServerTelemetry(this.telemetryCacheKey,a,this.correlationId)}}static maxErrorsToSend(e){let t,i=0,a=0;const r=e.errors.length;for(t=0;t<r;t++){const s=e.failedRequests[2*t]||f.EMPTY_STRING,n=e.failedRequests[2*t+1]||f.EMPTY_STRING,c=e.errors[t]||f.EMPTY_STRING;if(a+=s.toString().length+n.toString().length+c.length+3,a<B.MAX_LAST_HEADER_BYTES)i+=1;else break}return i}getRegionDiscoveryFields(){const e=[];return e.push(this.regionUsed||f.EMPTY_STRING),e.push(this.regionSource||f.EMPTY_STRING),e.push(this.regionOutcome||f.EMPTY_STRING),e.join(",")}updateRegionDiscoveryMetadata(e){this.regionUsed=e.region_used,this.regionSource=e.region_source,this.regionOutcome=e.region_outcome}setCacheOutcome(e){this.cacheOutcome=e}setNativeBrokerErrorCode(e){const t=this.getLastRequests();t.nativeBrokerErrorCode=e,this.cacheManager.setServerTelemetry(this.telemetryCacheKey,t,this.correlationId)}getNativeBrokerErrorCode(){return this.getLastRequests().nativeBrokerErrorCode}clearNativeBrokerErrorCode(){const e=this.getLastRequests();delete e.nativeBrokerErrorCode,this.cacheManager.setServerTelemetry(this.telemetryCacheKey,e,this.correlationId)}static makeExtraSkuString(e){return Eo(e)}}/*! @azure/msal-common v14.16.1 2025-08-05 */const Nr="missing_kid_error",Or="missing_alg_error";/*! @azure/msal-common v14.16.1 2025-08-05 */const Ro={[Nr]:"The JOSE Header for the requested JWT, JWS or JWK object requires a keyId to be configured as the 'kid' header claim. No 'kid' value was provided.",[Or]:"The JOSE Header for the requested JWT, JWS or JWK object requires an algorithm to be specified as the 'alg' header claim. No 'alg' value was provided."};class Ni extends D{constructor(e,t){super(e,t),this.name="JoseHeaderError",Object.setPrototypeOf(this,Ni.prototype)}}function Aa(o){return new Ni(o,Ro[o])}/*! @azure/msal-common v14.16.1 2025-08-05 */class Oi{constructor(e){this.typ=e.typ,this.alg=e.alg,this.kid=e.kid}static getShrHeaderString(e){if(!e.kid)throw Aa(Nr);if(!e.alg)throw Aa(Or);const t=new Oi({typ:e.typ||Os.Pop,kid:e.kid,alg:e.alg});return JSON.stringify(t)}}/*! @azure/msal-common v14.16.1 2025-08-05 */class Ta{startMeasurement(){}endMeasurement(){}flushMeasurement(){return null}}class xo{generateId(){return"callback-id"}startMeasurement(e,t){return{end:()=>null,discard:()=>{},add:()=>{},increment:()=>{},event:{eventId:this.generateId(),status:ho.InProgress,authority:"",libraryName:"",libraryVersion:"",clientId:"",name:e,startTimeMs:Date.now(),correlationId:t||""},measurement:new Ta}}startPerformanceMeasurement(){return new Ta}calculateQueuedTime(){return 0}addQueueMeasurement(){}setPreQueueTime(){}endMeasurement(){return null}discardMeasurements(){}removePerformanceCallback(){return!0}addPerformanceCallback(){return""}emitEvents(){}addFields(){}incrementFields(){}cacheEventByCorrelationId(){}}/*! @azure/msal-browser v3.30.0 2025-08-05 */const $i="pkce_not_created",ti="crypto_nonexistent",Mt="empty_navigate_uri",$r="hash_empty_error",Di="no_state_in_hash",Dr="hash_does_not_contain_known_properties",Lr="unable_to_parse_state",Hr="state_interaction_type_mismatch",Ur="interaction_in_progress",zr="popup_window_error",qr="empty_window_error",ke="user_cancelled",Po="monitor_popup_timeout",Fr="monitor_window_timeout",Br="redirect_in_iframe",Gr="block_iframe_reload",Kr="block_nested_popups",_o="iframe_closed_prematurely",Nt="silent_logout_unsupported",jr="no_account_error",Mo="silent_prompt_value_error",Vr="no_token_request_cache_error",Yr="unable_to_parse_token_request_cache_error",Li="no_cached_authority_error",No="auth_request_not_set_error",Oo="invalid_cache_type",Ot="non_browser_environment",Me="database_not_open",Tt="no_network_connectivity",Wr="post_request_failed",Jr="get_request_failed",ii="failed_to_parse_response",Qr="unable_to_load_token",Hi="crypto_key_not_found",Xr="auth_code_required",Zr="auth_code_or_nativeAccountId_required",es="spa_code_and_nativeAccountId_present",Ui="database_unavailable",ts="unable_to_acquire_token_from_native_platform",is="native_handshake_timeout",as="native_extension_not_installed",it="native_connection_not_established",rs="uninitialized_public_client_application",ss="native_prompt_not_supported",ns="invalid_base64_string",os="invalid_pop_token_request",cs="failed_to_build_headers",ls="failed_to_parse_headers";/*! @azure/msal-browser v3.30.0 2025-08-05 */const pe="For more visit: aka.ms/msaljs/browser-errors",$o={[$i]:"The PKCE code challenge and verifier could not be generated.",[ti]:"The crypto object or function is not available.",[Mt]:"Navigation URI is empty. Please check stack trace for more info.",[$r]:`Hash value cannot be processed because it is empty. Please verify that your redirectUri is not clearing the hash. ${pe}`,[Di]:"Hash does not contain state. Please verify that the request originated from msal.",[Dr]:`Hash does not contain known properites. Please verify that your redirectUri is not changing the hash.  ${pe}`,[Lr]:"Unable to parse state. Please verify that the request originated from msal.",[Hr]:"Hash contains state but the interaction type does not match the caller.",[Ur]:`Interaction is currently in progress. Please ensure that this interaction has been completed before calling an interactive API.   ${pe}`,[zr]:"Error opening popup window. This can happen if you are using IE or if popups are blocked in the browser.",[qr]:"window.open returned null or undefined window object.",[ke]:"User cancelled the flow.",[Po]:`Token acquisition in popup failed due to timeout.  ${pe}`,[Fr]:`Token acquisition in iframe failed due to timeout.  ${pe}`,[Br]:"Redirects are not supported for iframed or brokered applications. Please ensure you are using MSAL.js in a top frame of the window if using the redirect APIs, or use the popup APIs.",[Gr]:`Request was blocked inside an iframe because MSAL detected an authentication response.  ${pe}`,[Kr]:"Request was blocked inside a popup because MSAL detected it was running in a popup.",[_o]:"The iframe being monitored was closed prematurely.",[Nt]:"Silent logout not supported. Please call logoutRedirect or logoutPopup instead.",[jr]:"No account object provided to acquireTokenSilent and no active account has been set. Please call setActiveAccount or provide an account on the request.",[Mo]:"The value given for the prompt value is not valid for silent requests - must be set to 'none' or 'no_session'.",[Vr]:"No token request found in cache.",[Yr]:"The cached token request could not be parsed.",[Li]:"No cached authority found.",[No]:"Auth Request not set. Please ensure initiateAuthRequest was called from the InteractionHandler",[Oo]:"Invalid cache type",[Ot]:"Login and token requests are not supported in non-browser environments.",[Me]:"Database is not open!",[Tt]:"No network connectivity. Check your internet connection.",[Wr]:"Network request failed: If the browser threw a CORS error, check that the redirectUri is registered in the Azure App Portal as type 'SPA'",[Jr]:"Network request failed. Please check the network trace to determine root cause.",[ii]:"Failed to parse network response. Check network trace.",[Qr]:"Error loading token to cache.",[Hi]:"Cryptographic Key or Keypair not found in browser storage.",[Xr]:"An authorization code must be provided (as the `code` property on the request) to this flow.",[Zr]:"An authorization code or nativeAccountId must be provided to this flow.",[es]:"Request cannot contain both spa code and native account id.",[Ui]:"IndexedDB, which is required for persistent cryptographic key storage, is unavailable. This may be caused by browser privacy features which block persistent storage in third-party contexts.",[ts]:`Unable to acquire token from native platform.  ${pe}`,[is]:"Timed out while attempting to establish connection to browser extension",[as]:"Native extension is not installed. If you think this is a mistake call the initialize function.",[it]:`Connection to native platform has not been established. Please install a compatible browser extension and run initialize().  ${pe}`,[rs]:`You must call and await the initialize function before attempting to call any other MSAL API.  ${pe}`,[ss]:"The provided prompt is not supported by the native platform. This request should be routed to the web based flow.",[ns]:"Invalid base64 encoded string.",[os]:"Invalid PoP token request. The request should not have both a popKid value and signPopToken set to true.",[cs]:"Failed to build request headers object.",[ls]:"Failed to parse response headers"};class at extends D{constructor(e,t){super(e,$o[e],t),Object.setPrototypeOf(this,at.prototype),this.name="BrowserAuthError"}}function A(o,e){return new at(o,e)}/*! @azure/msal-browser v3.30.0 2025-08-05 */const Q={INVALID_GRANT_ERROR:"invalid_grant",POPUP_WIDTH:483,POPUP_HEIGHT:600,POPUP_NAME_PREFIX:"msal",DEFAULT_POLL_INTERVAL_MS:30,MSAL_SKU:"msal.js.browser"},De={CHANNEL_ID:"53ee284d-920a-4b59-9d30-a60315b26836",PREFERRED_EXTENSION_ID:"ppnbnpeolgkicgegkbkbjmhlideopiji",MATS_TELEMETRY:"MATS"},Ae={HandshakeRequest:"Handshake",HandshakeResponse:"HandshakeResponse",GetToken:"GetToken",Response:"Response"},Y={LocalStorage:"localStorage",SessionStorage:"sessionStorage",MemoryStorage:"memoryStorage"},Ia={GET:"GET",POST:"POST"},_={AUTHORITY:"authority",ACQUIRE_TOKEN_ACCOUNT:"acquireToken.account",SESSION_STATE:"session.state",REQUEST_STATE:"request.state",NONCE_IDTOKEN:"nonce.id_token",ORIGIN_URI:"request.origin",RENEW_STATUS:"token.renew.status",URL_HASH:"urlHash",REQUEST_PARAMS:"request.params",SCOPES:"scopes",INTERACTION_STATUS_KEY:"interaction.status",CCS_CREDENTIAL:"ccs.credential",CORRELATION_ID:"request.correlationId",NATIVE_REQUEST:"request.native",REDIRECT_CONTEXT:"request.redirect.context"},Z={ACCOUNT_KEYS:"msal.account.keys",TOKEN_KEYS:"msal.token.keys",VERSION:"msal.version"},lt={WRAPPER_SKU:"wrapper.sku",WRAPPER_VER:"wrapper.version"},$={acquireTokenRedirect:861,acquireTokenPopup:862,ssoSilent:863,acquireTokenSilent_authCode:864,handleRedirectPromise:865,acquireTokenByCode:866,acquireTokenSilent_silentFlow:61,logout:961,logoutPopup:962};var I;(function(o){o.Redirect="redirect",o.Popup="popup",o.Silent="silent",o.None="none"})(I||(I={}));const ka={scopes:Ge},ds="jwk",ai="msal.db",Do=1,Lo=`${ai}.keys`,J={Default:0,AccessToken:1,AccessTokenAndRefreshToken:2,RefreshToken:3,RefreshTokenAndNetwork:4,Skip:5},Ho=[J.Default,J.Skip,J.RefreshTokenAndNetwork],Uo="msal.browser.log.level",zo="msal.browser.log.pii";/*! @azure/msal-browser v3.30.0 2025-08-05 */function dt(o){return encodeURIComponent(zi(o).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_"))}function $t(o){return us(o).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function zi(o){return us(new TextEncoder().encode(o))}function us(o){const e=Array.from(o,t=>String.fromCodePoint(t)).join("");return btoa(e)}/*! @azure/msal-browser v3.30.0 2025-08-05 */const qo="RSASSA-PKCS1-v1_5",hs="SHA-256",Fo=2048,Bo=new Uint8Array([1,0,1]),Ea="0123456789abcdef",Sa=new Uint32Array(1),Go="crypto_subtle_undefined",qi={name:qo,hash:hs,modulusLength:Fo,publicExponent:Bo};function Ko(o){if(!window)throw A(Ot);if(!window.crypto)throw A(ti);if(!o&&!window.crypto.subtle)throw A(ti,Go)}async function ps(o,e,t){e==null||e.addQueueMeasurement(g.Sha256Digest,t);const a=new TextEncoder().encode(o);return window.crypto.subtle.digest(hs,a)}function jo(o){return window.crypto.getRandomValues(o)}function qt(){return window.crypto.getRandomValues(Sa),Sa[0]}function ue(){const o=Date.now(),e=qt()*1024+(qt()&1023),t=new Uint8Array(16),i=Math.trunc(e/2**30),a=e&2**30-1,r=qt();t[0]=o/2**40,t[1]=o/2**32,t[2]=o/2**24,t[3]=o/2**16,t[4]=o/2**8,t[5]=o,t[6]=112|i>>>8,t[7]=i,t[8]=128|a>>>24,t[9]=a>>>16,t[10]=a>>>8,t[11]=a,t[12]=r>>>24,t[13]=r>>>16,t[14]=r>>>8,t[15]=r;let s="";for(let n=0;n<t.length;n++)s+=Ea.charAt(t[n]>>>4),s+=Ea.charAt(t[n]&15),(n===3||n===5||n===7||n===9)&&(s+="-");return s}async function Vo(o,e){return window.crypto.subtle.generateKey(qi,o,e)}async function Ft(o){return window.crypto.subtle.exportKey(ds,o)}async function Yo(o,e,t){return window.crypto.subtle.importKey(ds,o,qi,e,t)}async function Wo(o,e){return window.crypto.subtle.sign(qi,o,e)}async function gs(o){const e=await ps(o),t=new Uint8Array(e);return $t(t)}/*! @azure/msal-browser v3.30.0 2025-08-05 */const Fi="storage_not_supported",Jo="stubbed_public_client_application_called",ms="in_mem_redirect_unavailable";/*! @azure/msal-browser v3.30.0 2025-08-05 */const Qo={[Fi]:"Given storage configuration option was not supported.",[Jo]:"Stub instance of Public Client Application was called. If using msal-react, please ensure context is not used without a provider. For more visit: aka.ms/msaljs/browser-errors",[ms]:"Redirect cannot be supported. In-memory storage was selected and storeAuthStateInCookie=false, which would cause the library to be unable to handle the incoming hash. If you would like to use the redirect API, please use session/localStorage or set storeAuthStateInCookie=true."};class Bi extends D{constructor(e,t){super(e,t),this.name="BrowserConfigurationAuthError",Object.setPrototypeOf(this,Bi.prototype)}}function Gi(o){return new Bi(o,Qo[o])}/*! @azure/msal-browser v3.30.0 2025-08-05 */function Xo(o){o.location.hash="",typeof o.history.replaceState=="function"&&o.history.replaceState(null,"",`${o.location.origin}${o.location.pathname}${o.location.search}`)}function Zo(o){const e=o.split("#");e.shift(),window.location.hash=e.length>0?e.join("#"):""}function Ki(){return window.parent!==window}function ec(){return typeof window<"u"&&!!window.opener&&window.opener!==window&&typeof window.name=="string"&&window.name.indexOf(`${Q.POPUP_NAME_PREFIX}.`)===0}function fe(){return typeof window<"u"&&window.location?window.location.href.split("?")[0].split("#")[0]:""}function tc(){const e=new x(window.location.href).getUrlComponents();return`${e.Protocol}//${e.HostNameAndPort}/`}function ic(){if(x.hashContainsKnownProperties(window.location.hash)&&Ki())throw A(Gr)}function ac(o){if(Ki()&&!o)throw A(Br)}function rc(){if(ec())throw A(Kr)}function fs(){if(typeof window>"u")throw A(Ot)}function vs(o){if(!o)throw A(rs)}function ji(o){fs(),ic(),rc(),vs(o)}function Ra(o,e){if(ji(o),ac(e.system.allowRedirectInIframe),e.cache.cacheLocation===Y.MemoryStorage&&!e.cache.storeAuthStateInCookie)throw Gi(ms)}function ys(o){const e=document.createElement("link");e.rel="preconnect",e.href=new URL(o).origin,e.crossOrigin="anonymous",document.head.appendChild(e),window.setTimeout(()=>{try{document.head.removeChild(e)}catch{}},1e4)}function sc(){return ue()}/*! @azure/msal-browser v3.30.0 2025-08-05 */class It{navigateInternal(e,t){return It.defaultNavigateWindow(e,t)}navigateExternal(e,t){return It.defaultNavigateWindow(e,t)}static defaultNavigateWindow(e,t){return t.noHistory?window.location.replace(e):window.location.assign(e),new Promise(i=>{setTimeout(()=>{i(!0)},t.timeout)})}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class nc{async sendGetRequestAsync(e,t){let i,a={},r=0;const s=xa(t);try{i=await fetch(e,{method:Ia.GET,headers:s})}catch{throw A(window.navigator.onLine?Jr:Tt)}a=Pa(i.headers);try{return r=i.status,{headers:a,body:await i.json(),status:r}}catch{throw ya(A(ii),r,a)}}async sendPostRequestAsync(e,t){const i=t&&t.body||"",a=xa(t);let r,s=0,n={};try{r=await fetch(e,{method:Ia.POST,headers:a,body:i})}catch{throw A(window.navigator.onLine?Wr:Tt)}n=Pa(r.headers);try{return s=r.status,{headers:n,body:await r.json(),status:s}}catch{throw ya(A(ii),s,n)}}}function xa(o){try{const e=new Headers;if(!(o&&o.headers))return e;const t=o.headers;return Object.entries(t).forEach(([i,a])=>{e.append(i,a)}),e}catch{throw A(cs)}}function Pa(o){try{const e={};return o.forEach((t,i)=>{e[i]=t}),e}catch{throw A(ls)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */const oc=6e4,ri=1e4,cc=3e4,lc=2e3;function dc({auth:o,cache:e,system:t,telemetry:i},a){const r={clientId:f.EMPTY_STRING,authority:`${f.DEFAULT_AUTHORITY}`,knownAuthorities:[],cloudDiscoveryMetadata:f.EMPTY_STRING,authorityMetadata:f.EMPTY_STRING,redirectUri:typeof window<"u"?fe():"",postLogoutRedirectUri:f.EMPTY_STRING,navigateToLoginRequestUrl:!0,clientCapabilities:[],protocolMode:ve.AAD,OIDCOptions:{serverResponseType:tt.FRAGMENT,defaultScopes:[f.OPENID_SCOPE,f.PROFILE_SCOPE,f.OFFLINE_ACCESS_SCOPE]},azureCloudOptions:{azureCloudInstance:yi.None,tenant:f.EMPTY_STRING},skipAuthorityMetadataCache:!1,supportsNestedAppAuth:!1,instanceAware:!1},s={cacheLocation:Y.SessionStorage,temporaryCacheLocation:Y.SessionStorage,storeAuthStateInCookie:!1,secureCookies:!1,cacheMigrationEnabled:!!(e&&e.cacheLocation===Y.LocalStorage),claimsBasedCachingEnabled:!1},n={loggerCallback:()=>{},logLevel:L.Info,piiLoggingEnabled:!1},l={...{...kr,loggerOptions:n,networkClient:a?new nc:ko,navigationClient:new It,loadFrameTimeout:0,windowHashTimeout:(t==null?void 0:t.loadFrameTimeout)||oc,iframeHashTimeout:(t==null?void 0:t.loadFrameTimeout)||ri,navigateFrameWait:0,redirectNavigationTimeout:cc,asyncPopups:!1,allowRedirectInIframe:!1,allowNativeBroker:!1,nativeBrokerHandshakeTimeout:(t==null?void 0:t.nativeBrokerHandshakeTimeout)||lc,pollIntervalMilliseconds:Q.DEFAULT_POLL_INTERVAL_MS},...t,loggerOptions:(t==null?void 0:t.loggerOptions)||n},d={application:{appName:f.EMPTY_STRING,appVersion:f.EMPTY_STRING},client:new xo};if((o==null?void 0:o.protocolMode)!==ve.OIDC&&(o!=null&&o.OIDCOptions)&&new Ce(l.loggerOptions).warning(JSON.stringify(O(fr))),o!=null&&o.protocolMode&&o.protocolMode!==ve.AAD&&(l!=null&&l.allowNativeBroker))throw O(vr);return{auth:{...r,...o,OIDCOptions:{...r.OIDCOptions,...o==null?void 0:o.OIDCOptions}},cache:{...s,...e},system:l,telemetry:{...d,...i}}}/*! @azure/msal-browser v3.30.0 2025-08-05 */const uc="@azure/msal-browser",Fe="3.30.0";/*! @azure/msal-browser v3.30.0 2025-08-05 */class Vi{static loggerCallback(e,t){switch(e){case L.Error:console.error(t);return;case L.Info:console.info(t);return;case L.Verbose:console.debug(t);return;case L.Warning:console.warn(t);return;default:console.log(t);return}}constructor(e){var c;this.browserEnvironment=typeof window<"u",this.config=dc(e,this.browserEnvironment);let t;try{t=window[Y.SessionStorage]}catch{}const i=t==null?void 0:t.getItem(Uo),a=(c=t==null?void 0:t.getItem(zo))==null?void 0:c.toLowerCase(),r=a==="true"?!0:a==="false"?!1:void 0,s={...this.config.system.loggerOptions},n=i&&Object.keys(L).includes(i)?L[i]:void 0;n&&(s.loggerCallback=Vi.loggerCallback,s.logLevel=n),r!==void 0&&(s.piiLoggingEnabled=r),this.logger=new Ce(s,uc,Fe),this.available=!1}getConfig(){return this.config}getLogger(){return this.logger}isAvailable(){return this.available}isBrowserEnvironment(){return this.browserEnvironment}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Ee extends Vi{getModuleName(){return Ee.MODULE_NAME}getId(){return Ee.ID}async initialize(){return this.available=typeof window<"u",this.available}}Ee.MODULE_NAME="";Ee.ID="StandardOperatingContext";/*! @azure/msal-browser v3.30.0 2025-08-05 */function le(o){return new TextDecoder().decode(hc(o))}function hc(o){let e=o.replace(/-/g,"+").replace(/_/g,"/");switch(e.length%4){case 0:break;case 2:e+="==";break;case 3:e+="=";break;default:throw A(ns)}const t=atob(e);return Uint8Array.from(t,i=>i.codePointAt(0)||0)}/*! @azure/msal-browser v3.30.0 2025-08-05 */class pc{constructor(){this.dbName=ai,this.version=Do,this.tableName=Lo,this.dbOpen=!1}async open(){return new Promise((e,t)=>{const i=window.indexedDB.open(this.dbName,this.version);i.addEventListener("upgradeneeded",a=>{a.target.result.createObjectStore(this.tableName)}),i.addEventListener("success",a=>{const r=a;this.db=r.target.result,this.dbOpen=!0,e()}),i.addEventListener("error",()=>t(A(Ui)))})}closeConnection(){const e=this.db;e&&this.dbOpen&&(e.close(),this.dbOpen=!1)}async validateDbIsOpen(){if(!this.dbOpen)return this.open()}async getItem(e){return await this.validateDbIsOpen(),new Promise((t,i)=>{if(!this.db)return i(A(Me));const s=this.db.transaction([this.tableName],"readonly").objectStore(this.tableName).get(e);s.addEventListener("success",n=>{const c=n;this.closeConnection(),t(c.target.result)}),s.addEventListener("error",n=>{this.closeConnection(),i(n)})})}async setItem(e,t){return await this.validateDbIsOpen(),new Promise((i,a)=>{if(!this.db)return a(A(Me));const n=this.db.transaction([this.tableName],"readwrite").objectStore(this.tableName).put(t,e);n.addEventListener("success",()=>{this.closeConnection(),i()}),n.addEventListener("error",c=>{this.closeConnection(),a(c)})})}async removeItem(e){return await this.validateDbIsOpen(),new Promise((t,i)=>{if(!this.db)return i(A(Me));const s=this.db.transaction([this.tableName],"readwrite").objectStore(this.tableName).delete(e);s.addEventListener("success",()=>{this.closeConnection(),t()}),s.addEventListener("error",n=>{this.closeConnection(),i(n)})})}async getKeys(){return await this.validateDbIsOpen(),new Promise((e,t)=>{if(!this.db)return t(A(Me));const r=this.db.transaction([this.tableName],"readonly").objectStore(this.tableName).getAllKeys();r.addEventListener("success",s=>{const n=s;this.closeConnection(),e(n.target.result)}),r.addEventListener("error",s=>{this.closeConnection(),t(s)})})}async containsKey(e){return await this.validateDbIsOpen(),new Promise((t,i)=>{if(!this.db)return i(A(Me));const s=this.db.transaction([this.tableName],"readonly").objectStore(this.tableName).count(e);s.addEventListener("success",n=>{const c=n;this.closeConnection(),t(c.target.result===1)}),s.addEventListener("error",n=>{this.closeConnection(),i(n)})})}async deleteDatabase(){return this.db&&this.dbOpen&&this.closeConnection(),new Promise((e,t)=>{const i=window.indexedDB.deleteDatabase(ai),a=setTimeout(()=>t(!1),200);i.addEventListener("success",()=>(clearTimeout(a),e(!0))),i.addEventListener("blocked",()=>(clearTimeout(a),e(!0))),i.addEventListener("error",()=>(clearTimeout(a),t(!1)))})}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class si{constructor(){this.cache=new Map}getItem(e){return this.cache.get(e)||null}setItem(e,t){this.cache.set(e,t)}removeItem(e){this.cache.delete(e)}getKeys(){const e=[];return this.cache.forEach((t,i)=>{e.push(i)}),e}containsKey(e){return this.cache.has(e)}clear(){this.cache.clear()}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class gc{constructor(e){this.inMemoryCache=new si,this.indexedDBCache=new pc,this.logger=e}handleDatabaseAccessError(e){if(e instanceof at&&e.errorCode===Ui)this.logger.error("Could not access persistent storage. This may be caused by browser privacy features which block persistent storage in third-party contexts.");else throw e}async getItem(e){const t=this.inMemoryCache.getItem(e);if(!t)try{return this.logger.verbose("Queried item not found in in-memory cache, now querying persistent storage."),await this.indexedDBCache.getItem(e)}catch(i){this.handleDatabaseAccessError(i)}return t}async setItem(e,t){this.inMemoryCache.setItem(e,t);try{await this.indexedDBCache.setItem(e,t)}catch(i){this.handleDatabaseAccessError(i)}}async removeItem(e){this.inMemoryCache.removeItem(e);try{await this.indexedDBCache.removeItem(e)}catch(t){this.handleDatabaseAccessError(t)}}async getKeys(){const e=this.inMemoryCache.getKeys();if(e.length===0)try{return this.logger.verbose("In-memory cache is empty, now querying persistent storage."),await this.indexedDBCache.getKeys()}catch(t){this.handleDatabaseAccessError(t)}return e}async containsKey(e){const t=this.inMemoryCache.containsKey(e);if(!t)try{return this.logger.verbose("Key not found in in-memory cache, now querying persistent storage."),await this.indexedDBCache.containsKey(e)}catch(i){this.handleDatabaseAccessError(i)}return t}clearInMemory(){this.logger.verbose("Deleting in-memory keystore"),this.inMemoryCache.clear(),this.logger.verbose("In-memory keystore deleted")}async clearPersistent(){try{this.logger.verbose("Deleting persistent keystore");const e=await this.indexedDBCache.deleteDatabase();return e&&this.logger.verbose("Persistent keystore deleted"),e}catch(e){return this.handleDatabaseAccessError(e),!1}}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Be{constructor(e,t,i){this.logger=e,Ko(i??!1),this.cache=new gc(this.logger),this.performanceClient=t}createNewGuid(){return ue()}base64Encode(e){return zi(e)}base64Decode(e){return le(e)}base64UrlEncode(e){return dt(e)}encodeKid(e){return this.base64UrlEncode(JSON.stringify({kid:e}))}async getPublicKeyThumbprint(e){var d;const t=(d=this.performanceClient)==null?void 0:d.startMeasurement(g.CryptoOptsGetPublicKeyThumbprint,e.correlationId),i=await Vo(Be.EXTRACTABLE,Be.POP_KEY_USAGES),a=await Ft(i.publicKey),r={e:a.e,kty:a.kty,n:a.n},s=_a(r),n=await this.hashString(s),c=await Ft(i.privateKey),l=await Yo(c,!1,["sign"]);return await this.cache.setItem(n,{privateKey:l,publicKey:i.publicKey,requestMethod:e.resourceRequestMethod,requestUri:e.resourceRequestUri}),t&&t.end({success:!0}),n}async removeTokenBindingKey(e){return await this.cache.removeItem(e),!await this.cache.containsKey(e)}async clearKeystore(){this.cache.clearInMemory();try{return await this.cache.clearPersistent(),!0}catch(e){return e instanceof Error?this.logger.error(`Clearing keystore failed with error: ${e.message}`):this.logger.error("Clearing keystore failed with unknown error"),!1}}async signJwt(e,t,i,a){var P;const r=(P=this.performanceClient)==null?void 0:P.startMeasurement(g.CryptoOptsSignJwt,a),s=await this.cache.getItem(t);if(!s)throw A(Hi);const n=await Ft(s.publicKey),c=_a(n),l=dt(JSON.stringify({kid:t})),d=Oi.getShrHeaderString({...i==null?void 0:i.header,alg:n.alg,kid:l}),u=dt(d);e.cnf={jwk:JSON.parse(c)};const p=dt(JSON.stringify(e)),h=`${u}.${p}`,v=new TextEncoder().encode(h),w=await Wo(s.privateKey,v),C=$t(new Uint8Array(w)),T=`${h}.${C}`;return r&&r.end({success:!0}),T}async hashString(e){return gs(e)}}Be.POP_KEY_USAGES=["sign","verify"];Be.EXTRACTABLE=!0;function _a(o){return JSON.stringify(o,Object.keys(o).sort())}/*! @azure/msal-browser v3.30.0 2025-08-05 */class mc{constructor(){if(!window.localStorage)throw Gi(Fi)}getItem(e){return window.localStorage.getItem(e)}setItem(e,t){window.localStorage.setItem(e,t)}removeItem(e){window.localStorage.removeItem(e)}getKeys(){return Object.keys(window.localStorage)}containsKey(e){return window.localStorage.hasOwnProperty(e)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class fc{constructor(){if(!window.sessionStorage)throw Gi(Fi)}getItem(e){return window.sessionStorage.getItem(e)}setItem(e,t){window.sessionStorage.setItem(e,t)}removeItem(e){window.sessionStorage.removeItem(e)}getKeys(){return Object.keys(window.sessionStorage)}containsKey(e){return window.sessionStorage.hasOwnProperty(e)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */function bs(o,e){if(!e)return null;try{return ae.parseRequestState(o,e).libraryState.meta}catch{throw y(ze)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */const vc=24*60*60*1e3;class yc{getItem(e){const t=`${encodeURIComponent(e)}`,i=document.cookie.split(";");for(let a=0;a<i.length;a++){const r=i[a],[s,...n]=decodeURIComponent(r).trim().split("="),c=n.join("=");if(s===t)return c}return""}setItem(e,t,i,a=!0){let r=`${encodeURIComponent(e)}=${encodeURIComponent(t)};path=/;SameSite=Lax;`;if(i){const s=bc(i);r+=`expires=${s};`}a&&(r+="Secure;"),document.cookie=r}removeItem(e){this.setItem(e,"",-1)}getKeys(){const e=document.cookie.split(";"),t=[];return e.forEach(i=>{const a=decodeURIComponent(i).trim().split("=");t.push(a[0])}),t}containsKey(e){return this.getKeys().includes(e)}}function bc(o){const e=new Date;return new Date(e.getTime()+o*vc).toUTCString()}/*! @azure/msal-browser v3.30.0 2025-08-05 */class ni extends wt{constructor(e,t,i,a,r,s){super(e,i,a,r),this.cacheConfig=t,this.logger=a,this.internalStorage=new si,this.browserStorage=this.setupBrowserStorage(this.cacheConfig.cacheLocation),this.temporaryCacheStorage=this.setupBrowserStorage(this.cacheConfig.temporaryCacheLocation),this.cookieStorage=new yc,t.cacheMigrationEnabled&&(this.migrateCacheEntries(),this.createKeyMaps()),this.performanceClient=s}setupBrowserStorage(e){try{switch(e){case Y.LocalStorage:return new mc;case Y.SessionStorage:return new fc;case Y.MemoryStorage:default:break}}catch(t){this.logger.error(t)}return this.cacheConfig.cacheLocation=Y.MemoryStorage,new si}migrateCacheEntries(){const e=this.browserStorage.getItem(Z.VERSION);e&&this.logger.info(`MSAL.js was last initialized with version ${e}`),e!==Fe&&this.browserStorage.setItem(Z.VERSION,Fe);const t=`${f.CACHE_PREFIX}.${q.ID_TOKEN}`,i=`${f.CACHE_PREFIX}.${q.CLIENT_INFO}`,a=`${f.CACHE_PREFIX}.${q.ERROR}`,r=`${f.CACHE_PREFIX}.${q.ERROR_DESC}`,s=this.browserStorage.getItem(t),n=this.browserStorage.getItem(i),c=this.browserStorage.getItem(a),l=this.browserStorage.getItem(r),d=[s,n,c,l];[q.ID_TOKEN,q.CLIENT_INFO,q.ERROR,q.ERROR_DESC].forEach((p,h)=>{const m=d[h];m&&this.setTemporaryCache(p,m,!0)})}createKeyMaps(){this.logger.trace("BrowserCacheManager - createKeyMaps called.");const e=this.cryptoImpl.createNewGuid(),t=this.getItem(Z.ACCOUNT_KEYS),i=this.getItem(`${Z.TOKEN_KEYS}.${this.clientId}`);if(t&&i){this.logger.verbose("BrowserCacheManager:createKeyMaps - account and token key maps already exist, skipping migration.");return}this.browserStorage.getKeys().forEach(r=>{if(this.isCredentialKey(r)){const s=this.getItem(r);if(s){const n=this.validateAndParseJson(s);if(n&&n.hasOwnProperty("credentialType"))switch(n.credentialType){case S.ID_TOKEN:if(ca(n)){this.logger.trace("BrowserCacheManager:createKeyMaps - idToken found, saving key to token key map"),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - idToken with key: ${r} found, saving key to token key map`);const c=n,l=this.updateCredentialCacheKey(r,c,e);this.addTokenKey(l,S.ID_TOKEN,e);return}else this.logger.trace("BrowserCacheManager:createKeyMaps - key found matching idToken schema with value containing idToken credentialType field but value failed IdTokenEntity validation, skipping."),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - failed idToken validation on key: ${r}`);break;case S.ACCESS_TOKEN:case S.ACCESS_TOKEN_WITH_AUTH_SCHEME:if(oa(n)){this.logger.trace("BrowserCacheManager:createKeyMaps - accessToken found, saving key to token key map"),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - accessToken with key: ${r} found, saving key to token key map`);const c=n,l=this.updateCredentialCacheKey(r,c,e);this.addTokenKey(l,S.ACCESS_TOKEN,e);return}else this.logger.trace("BrowserCacheManager:createKeyMaps - key found matching accessToken schema with value containing accessToken credentialType field but value failed AccessTokenEntity validation, skipping."),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - failed accessToken validation on key: ${r}`);break;case S.REFRESH_TOKEN:if(la(n)){this.logger.trace("BrowserCacheManager:createKeyMaps - refreshToken found, saving key to token key map"),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - refreshToken with key: ${r} found, saving key to token key map`);const c=n,l=this.updateCredentialCacheKey(r,c,e);this.addTokenKey(l,S.REFRESH_TOKEN,e);return}else this.logger.trace("BrowserCacheManager:createKeyMaps - key found matching refreshToken schema with value containing refreshToken credentialType field but value failed RefreshTokenEntity validation, skipping."),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - failed refreshToken validation on key: ${r}`);break}}}if(this.isAccountKey(r)){const s=this.getItem(r);if(s){const n=this.validateAndParseJson(s);n&&z.isAccountEntity(n)&&(this.logger.trace("BrowserCacheManager:createKeyMaps - account found, saving key to account key map"),this.logger.tracePii(`BrowserCacheManager:createKeyMaps - account with key: ${r} found, saving key to account key map`),this.addAccountKeyToMap(r,e))}}})}validateAndParseJson(e){try{const t=JSON.parse(e);return t&&typeof t=="object"?t:null}catch{return null}}getItem(e){return this.browserStorage.getItem(e)}setItem(e,t,i){let a=[];for(let s=0;s<=20;s++)try{this.browserStorage.setItem(e,t),s>0&&this.removeAccessTokenKeys(a.slice(0,s),i);break}catch(n){const c=Tr(n);if(c.errorCode===Si&&s<20){if(a.length||(e===`${Z.TOKEN_KEYS}.${this.clientId}`?a=JSON.parse(t).accessToken:a=this.getTokenKeys().accessToken),a.length<=s)throw c;this.removeAccessToken(a[s],i,!1)}else throw c}}getAccount(e,t,i){this.logger.trace("BrowserCacheManager.getAccount called");const a=this.getCachedAccountEntity(e,t);return this.updateOutdatedCachedAccount(e,a,t,i)}getCachedAccountEntity(e,t){const i=this.getItem(e);if(!i)return this.removeAccountKeyFromMap(e,t),null;const a=this.validateAndParseJson(i);return!a||!z.isAccountEntity(a)?null:wt.toObject(new z,a)}setAccount(e,t){this.logger.trace("BrowserCacheManager.setAccount called");const i=e.generateAccountKey();e.lastUpdatedAt=Date.now().toString(),this.setItem(i,JSON.stringify(e),t),this.addAccountKeyToMap(i,t)}getAccountKeys(){this.logger.trace("BrowserCacheManager.getAccountKeys called");const e=this.getItem(Z.ACCOUNT_KEYS);return e?JSON.parse(e):(this.logger.verbose("BrowserCacheManager.getAccountKeys - No account keys found"),[])}addAccountKeyToMap(e,t){this.logger.trace("BrowserCacheManager.addAccountKeyToMap called"),this.logger.tracePii(`BrowserCacheManager.addAccountKeyToMap called with key: ${e}`);const i=this.getAccountKeys();i.indexOf(e)===-1?(i.push(e),this.setItem(Z.ACCOUNT_KEYS,JSON.stringify(i),t),this.logger.verbose("BrowserCacheManager.addAccountKeyToMap account key added")):this.logger.verbose("BrowserCacheManager.addAccountKeyToMap account key already exists in map")}removeAccountKeyFromMap(e,t){this.logger.trace("BrowserCacheManager.removeAccountKeyFromMap called"),this.logger.tracePii(`BrowserCacheManager.removeAccountKeyFromMap called with key: ${e}`);const i=this.getAccountKeys(),a=i.indexOf(e);if(a>-1){if(i.splice(a,1),i.length===0){this.removeItem(Z.ACCOUNT_KEYS);return}else this.setItem(Z.ACCOUNT_KEYS,JSON.stringify(i),t);this.logger.trace("BrowserCacheManager.removeAccountKeyFromMap account key removed")}else this.logger.trace("BrowserCacheManager.removeAccountKeyFromMap key not found in existing map")}async removeAccount(e,t){super.removeAccount(e,t),this.removeAccountKeyFromMap(e,t)}removeOutdatedAccount(e,t){this.removeItem(e),this.removeAccountKeyFromMap(e,t)}removeIdToken(e,t){super.removeIdToken(e,t),this.removeTokenKey(e,S.ID_TOKEN,t)}removeAccessToken(e,t,i=!0){var a;super.removeAccessToken(e,t),(a=this.performanceClient)==null||a.incrementFields({accessTokensRemoved:1},t),i&&this.removeTokenKey(e,S.ACCESS_TOKEN,t)}removeAccessTokenKeys(e,t){this.logger.trace("removeAccessTokenKey called");const i=this.getTokenKeys();let a=0;if(e.forEach(r=>{const s=i.accessToken.indexOf(r);s>-1&&(i.accessToken.splice(s,1),a++)}),a>0){this.logger.info(`removed ${a} accessToken keys from tokenKeys map`),this.setTokenKeys(i,t);return}}removeRefreshToken(e,t){super.removeRefreshToken(e,t),this.removeTokenKey(e,S.REFRESH_TOKEN,t)}getTokenKeys(){this.logger.trace("BrowserCacheManager.getTokenKeys called");const e=this.getItem(`${Z.TOKEN_KEYS}.${this.clientId}`);if(e){const t=this.validateAndParseJson(e);if(t&&t.hasOwnProperty("idToken")&&t.hasOwnProperty("accessToken")&&t.hasOwnProperty("refreshToken"))return t;this.logger.error("BrowserCacheManager.getTokenKeys - Token keys found but in an unknown format. Returning empty key map.")}else this.logger.verbose("BrowserCacheManager.getTokenKeys - No token keys found");return{idToken:[],accessToken:[],refreshToken:[]}}setTokenKeys(e,t){if(e.idToken.length===0&&e.accessToken.length===0&&e.refreshToken.length===0){this.removeItem(`${Z.TOKEN_KEYS}.${this.clientId}`);return}else this.setItem(`${Z.TOKEN_KEYS}.${this.clientId}`,JSON.stringify(e),t)}addTokenKey(e,t,i){this.logger.trace("BrowserCacheManager addTokenKey called");const a=this.getTokenKeys();switch(t){case S.ID_TOKEN:a.idToken.indexOf(e)===-1&&(this.logger.info("BrowserCacheManager: addTokenKey - idToken added to map"),a.idToken.push(e));break;case S.ACCESS_TOKEN:const r=a.accessToken.indexOf(e);r!==-1&&a.accessToken.splice(r,1),this.logger.trace(`access token ${r===-1?"added to":"updated in"} map`),a.accessToken.push(e);break;case S.REFRESH_TOKEN:a.refreshToken.indexOf(e)===-1&&(this.logger.info("BrowserCacheManager: addTokenKey - refreshToken added to map"),a.refreshToken.push(e));break;default:throw this.logger.error(`BrowserCacheManager:addTokenKey - CredentialType provided invalid. CredentialType: ${t}`),y(Wt)}this.setTokenKeys(a,i)}removeTokenKey(e,t,i,a=this.getTokenKeys()){switch(this.logger.trace("BrowserCacheManager removeTokenKey called"),t){case S.ID_TOKEN:this.logger.infoPii(`BrowserCacheManager: removeTokenKey - attempting to remove idToken with key: ${e} from map`);const r=a.idToken.indexOf(e);r>-1?(this.logger.info("BrowserCacheManager: removeTokenKey - idToken removed from map"),a.idToken.splice(r,1)):this.logger.info("BrowserCacheManager: removeTokenKey - idToken does not exist in map. Either it was previously removed or it was never added.");break;case S.ACCESS_TOKEN:this.logger.infoPii(`BrowserCacheManager: removeTokenKey - attempting to remove accessToken with key: ${e} from map`);const s=a.accessToken.indexOf(e);s>-1?(this.logger.info("BrowserCacheManager: removeTokenKey - accessToken removed from map"),a.accessToken.splice(s,1)):this.logger.info("BrowserCacheManager: removeTokenKey - accessToken does not exist in map. Either it was previously removed or it was never added.");break;case S.REFRESH_TOKEN:this.logger.infoPii(`BrowserCacheManager: removeTokenKey - attempting to remove refreshToken with key: ${e} from map`);const n=a.refreshToken.indexOf(e);n>-1?(this.logger.info("BrowserCacheManager: removeTokenKey - refreshToken removed from map"),a.refreshToken.splice(n,1)):this.logger.info("BrowserCacheManager: removeTokenKey - refreshToken does not exist in map. Either it was previously removed or it was never added.");break;default:throw this.logger.error(`BrowserCacheManager:removeTokenKey - CredentialType provided invalid. CredentialType: ${t}`),y(Wt)}this.setTokenKeys(a,i)}getIdTokenCredential(e,t){const i=this.getItem(e);if(!i)return this.logger.trace("BrowserCacheManager.getIdTokenCredential: called, no cache hit"),this.removeIdToken(e,t),null;const a=this.validateAndParseJson(i);return!a||!ca(a)?(this.logger.trace("BrowserCacheManager.getIdTokenCredential: called, no cache hit"),null):(this.logger.trace("BrowserCacheManager.getIdTokenCredential: cache hit"),a)}setIdTokenCredential(e,t){this.logger.trace("BrowserCacheManager.setIdTokenCredential called");const i=Oe(e);e.lastUpdatedAt=Date.now().toString(),this.setItem(i,JSON.stringify(e),t),this.addTokenKey(i,S.ID_TOKEN,t)}getAccessTokenCredential(e,t){const i=this.getItem(e);if(!i)return this.logger.trace("BrowserCacheManager.getAccessTokenCredential: called, no cache hit"),this.removeTokenKey(e,S.ACCESS_TOKEN,t),null;const a=this.validateAndParseJson(i);return!a||!oa(a)?(this.logger.trace("BrowserCacheManager.getAccessTokenCredential: called, no cache hit"),null):(this.logger.trace("BrowserCacheManager.getAccessTokenCredential: cache hit"),a)}setAccessTokenCredential(e,t){this.logger.trace("BrowserCacheManager.setAccessTokenCredential called");const i=Oe(e);e.lastUpdatedAt=Date.now().toString(),this.setItem(i,JSON.stringify(e),t),this.addTokenKey(i,S.ACCESS_TOKEN,t)}getRefreshTokenCredential(e,t){const i=this.getItem(e);if(!i)return this.logger.trace("BrowserCacheManager.getRefreshTokenCredential: called, no cache hit"),this.removeTokenKey(e,S.REFRESH_TOKEN,t),null;const a=this.validateAndParseJson(i);return!a||!la(a)?(this.logger.trace("BrowserCacheManager.getRefreshTokenCredential: called, no cache hit"),null):(this.logger.trace("BrowserCacheManager.getRefreshTokenCredential: cache hit"),a)}setRefreshTokenCredential(e,t){this.logger.trace("BrowserCacheManager.setRefreshTokenCredential called");const i=Oe(e);e.lastUpdatedAt=Date.now().toString(),this.setItem(i,JSON.stringify(e),t),this.addTokenKey(i,S.REFRESH_TOKEN,t)}getAppMetadata(e){const t=this.getItem(e);if(!t)return this.logger.trace("BrowserCacheManager.getAppMetadata: called, no cache hit"),null;const i=this.validateAndParseJson(t);return!i||!on(e,i)?(this.logger.trace("BrowserCacheManager.getAppMetadata: called, no cache hit"),null):(this.logger.trace("BrowserCacheManager.getAppMetadata: cache hit"),i)}setAppMetadata(e,t){this.logger.trace("BrowserCacheManager.setAppMetadata called");const i=nn(e);this.setItem(i,JSON.stringify(e),t)}getServerTelemetry(e){const t=this.getItem(e);if(!t)return this.logger.trace("BrowserCacheManager.getServerTelemetry: called, no cache hit"),null;const i=this.validateAndParseJson(t);return!i||!rn(e,i)?(this.logger.trace("BrowserCacheManager.getServerTelemetry: called, no cache hit"),null):(this.logger.trace("BrowserCacheManager.getServerTelemetry: cache hit"),i)}setServerTelemetry(e,t,i){this.logger.trace("BrowserCacheManager.setServerTelemetry called"),this.setItem(e,JSON.stringify(t),i)}getAuthorityMetadata(e){const t=this.internalStorage.getItem(e);if(!t)return this.logger.trace("BrowserCacheManager.getAuthorityMetadata: called, no cache hit"),null;const i=this.validateAndParseJson(t);return i&&cn(e,i)?(this.logger.trace("BrowserCacheManager.getAuthorityMetadata: cache hit"),i):null}getAuthorityMetadataKeys(){return this.internalStorage.getKeys().filter(t=>this.isAuthorityMetadata(t))}setWrapperMetadata(e,t){this.internalStorage.setItem(lt.WRAPPER_SKU,e),this.internalStorage.setItem(lt.WRAPPER_VER,t)}getWrapperMetadata(){const e=this.internalStorage.getItem(lt.WRAPPER_SKU)||f.EMPTY_STRING,t=this.internalStorage.getItem(lt.WRAPPER_VER)||f.EMPTY_STRING;return[e,t]}setAuthorityMetadata(e,t){this.logger.trace("BrowserCacheManager.setAuthorityMetadata called"),this.internalStorage.setItem(e,JSON.stringify(t))}getActiveAccount(e){const t=this.generateCacheKey(q.ACTIVE_ACCOUNT_FILTERS),i=this.getItem(t);if(!i){this.logger.trace("BrowserCacheManager.getActiveAccount: No active account filters cache schema found, looking for legacy schema");const r=this.generateCacheKey(q.ACTIVE_ACCOUNT),s=this.getItem(r);if(!s)return this.logger.trace("BrowserCacheManager.getActiveAccount: No active account found"),null;const n=this.getAccountInfoFilteredBy({localAccountId:s},e);return n?(this.logger.trace("BrowserCacheManager.getActiveAccount: Legacy active account cache schema found"),this.logger.trace("BrowserCacheManager.getActiveAccount: Adding active account filters cache schema"),this.setActiveAccount(n,e),n):null}const a=this.validateAndParseJson(i);return a?(this.logger.trace("BrowserCacheManager.getActiveAccount: Active account filters schema found"),this.getAccountInfoFilteredBy({homeAccountId:a.homeAccountId,localAccountId:a.localAccountId,tenantId:a.tenantId},e)):(this.logger.trace("BrowserCacheManager.getActiveAccount: No active account found"),null)}setActiveAccount(e,t){const i=this.generateCacheKey(q.ACTIVE_ACCOUNT_FILTERS),a=this.generateCacheKey(q.ACTIVE_ACCOUNT);if(e){this.logger.verbose("setActiveAccount: Active account set");const r={homeAccountId:e.homeAccountId,localAccountId:e.localAccountId,tenantId:e.tenantId,lastUpdatedAt:Date.now().toString()};this.setItem(i,JSON.stringify(r),t),this.setItem(a,e.localAccountId,t)}else this.logger.verbose("setActiveAccount: No account passed, active account not set"),this.browserStorage.removeItem(i),this.browserStorage.removeItem(a)}getThrottlingCache(e){const t=this.getItem(e);if(!t)return this.logger.trace("BrowserCacheManager.getThrottlingCache: called, no cache hit"),null;const i=this.validateAndParseJson(t);return!i||!sn(e,i)?(this.logger.trace("BrowserCacheManager.getThrottlingCache: called, no cache hit"),null):(this.logger.trace("BrowserCacheManager.getThrottlingCache: cache hit"),i)}setThrottlingCache(e,t,i){this.logger.trace("BrowserCacheManager.setThrottlingCache called"),this.setItem(e,JSON.stringify(t),i)}getTemporaryCache(e,t){const i=t?this.generateCacheKey(e):e;if(this.cacheConfig.storeAuthStateInCookie){const r=this.cookieStorage.getItem(i);if(r)return this.logger.trace("BrowserCacheManager.getTemporaryCache: storeAuthStateInCookies set to true, retrieving from cookies"),r}const a=this.temporaryCacheStorage.getItem(i);if(!a){if(this.cacheConfig.cacheLocation===Y.LocalStorage){const r=this.browserStorage.getItem(i);if(r)return this.logger.trace("BrowserCacheManager.getTemporaryCache: Temporary cache item found in local storage"),r}return this.logger.trace("BrowserCacheManager.getTemporaryCache: No cache item found in local storage"),null}return this.logger.trace("BrowserCacheManager.getTemporaryCache: Temporary cache item returned"),a}setTemporaryCache(e,t,i){const a=i?this.generateCacheKey(e):e;this.temporaryCacheStorage.setItem(a,t),this.cacheConfig.storeAuthStateInCookie&&(this.logger.trace("BrowserCacheManager.setTemporaryCache: storeAuthStateInCookie set to true, setting item cookie"),this.cookieStorage.setItem(a,t,void 0,this.cacheConfig.secureCookies))}removeItem(e){this.browserStorage.removeItem(e)}removeTemporaryItem(e){this.temporaryCacheStorage.removeItem(e),this.cacheConfig.storeAuthStateInCookie&&(this.logger.trace("BrowserCacheManager.removeItem: storeAuthStateInCookie is true, clearing item cookie"),this.cookieStorage.removeItem(e))}getKeys(){return this.browserStorage.getKeys()}async clear(e){await this.removeAllAccounts(e),this.removeAppMetadata(e),this.temporaryCacheStorage.getKeys().forEach(t=>{(t.indexOf(f.CACHE_PREFIX)!==-1||t.indexOf(this.clientId)!==-1)&&this.removeTemporaryItem(t)}),this.browserStorage.getKeys().forEach(t=>{(t.indexOf(f.CACHE_PREFIX)!==-1||t.indexOf(this.clientId)!==-1)&&this.browserStorage.removeItem(t)}),this.internalStorage.clear()}async clearTokensAndKeysWithClaims(e,t){e.addQueueMeasurement(g.ClearTokensAndKeysWithClaims,t);const i=this.getTokenKeys();let a=0;i.accessToken.forEach(r=>{const s=this.getAccessTokenCredential(r,t);s!=null&&s.requestedClaimsHash&&r.includes(s.requestedClaimsHash.toLowerCase())&&(this.removeAccessToken(r,t),a++)}),a>0&&this.logger.warning(`${a} access tokens with claims in the cache keys have been removed from the cache.`)}generateCacheKey(e){return this.validateAndParseJson(e)?JSON.stringify(e):ie.startsWith(e,f.CACHE_PREFIX)||ie.startsWith(e,q.ADAL_ID_TOKEN)?e:`${f.CACHE_PREFIX}.${this.clientId}.${e}`}generateAuthorityKey(e){const{libraryState:{id:t}}=ae.parseRequestState(this.cryptoImpl,e);return this.generateCacheKey(`${_.AUTHORITY}.${t}`)}generateNonceKey(e){const{libraryState:{id:t}}=ae.parseRequestState(this.cryptoImpl,e);return this.generateCacheKey(`${_.NONCE_IDTOKEN}.${t}`)}generateStateKey(e){const{libraryState:{id:t}}=ae.parseRequestState(this.cryptoImpl,e);return this.generateCacheKey(`${_.REQUEST_STATE}.${t}`)}getCachedAuthority(e){const t=this.generateStateKey(e),i=this.getTemporaryCache(t);if(!i)return null;const a=this.generateAuthorityKey(i);return this.getTemporaryCache(a)}updateCacheEntries(e,t,i,a,r){this.logger.trace("BrowserCacheManager.updateCacheEntries called");const s=this.generateStateKey(e);this.setTemporaryCache(s,e,!1);const n=this.generateNonceKey(e);this.setTemporaryCache(n,t,!1);const c=this.generateAuthorityKey(e);if(this.setTemporaryCache(c,i,!1),r){const l={credential:r.homeAccountId,type:X.HOME_ACCOUNT_ID};this.setTemporaryCache(_.CCS_CREDENTIAL,JSON.stringify(l),!0)}else if(a){const l={credential:a,type:X.UPN};this.setTemporaryCache(_.CCS_CREDENTIAL,JSON.stringify(l),!0)}}resetRequestCache(e){this.logger.trace("BrowserCacheManager.resetRequestCache called"),e&&(this.temporaryCacheStorage.getKeys().forEach(t=>{t.indexOf(e)!==-1&&this.removeTemporaryItem(t)}),this.removeTemporaryItem(this.generateStateKey(e)),this.removeTemporaryItem(this.generateNonceKey(e)),this.removeTemporaryItem(this.generateAuthorityKey(e))),this.removeTemporaryItem(this.generateCacheKey(_.REQUEST_PARAMS)),this.removeTemporaryItem(this.generateCacheKey(_.ORIGIN_URI)),this.removeTemporaryItem(this.generateCacheKey(_.URL_HASH)),this.removeTemporaryItem(this.generateCacheKey(_.CORRELATION_ID)),this.removeTemporaryItem(this.generateCacheKey(_.CCS_CREDENTIAL)),this.removeTemporaryItem(this.generateCacheKey(_.NATIVE_REQUEST)),this.setInteractionInProgress(!1)}cleanRequestByState(e){if(this.logger.trace("BrowserCacheManager.cleanRequestByState called"),e){const t=this.generateStateKey(e),i=this.temporaryCacheStorage.getItem(t);this.logger.infoPii(`BrowserCacheManager.cleanRequestByState: Removing temporary cache items for state: ${i}`),this.resetRequestCache(i||f.EMPTY_STRING)}}cleanRequestByInteractionType(e){this.logger.trace("BrowserCacheManager.cleanRequestByInteractionType called"),this.temporaryCacheStorage.getKeys().forEach(t=>{if(t.indexOf(_.REQUEST_STATE)===-1)return;const i=this.temporaryCacheStorage.getItem(t);if(!i)return;const a=bs(this.cryptoImpl,i);a&&a.interactionType===e&&(this.logger.infoPii(`BrowserCacheManager.cleanRequestByInteractionType: Removing temporary cache items for state: ${i}`),this.resetRequestCache(i))}),this.setInteractionInProgress(!1)}cacheCodeRequest(e){this.logger.trace("BrowserCacheManager.cacheCodeRequest called");const t=zi(JSON.stringify(e));this.setTemporaryCache(_.REQUEST_PARAMS,t,!0)}getCachedRequest(e){this.logger.trace("BrowserCacheManager.getCachedRequest called");const t=this.getTemporaryCache(_.REQUEST_PARAMS,!0);if(!t)throw A(Vr);let i;try{i=JSON.parse(le(t))}catch(a){throw this.logger.errorPii(`Attempted to parse: ${t}`),this.logger.error(`Parsing cached token request threw with error: ${a}`),A(Yr)}if(this.removeTemporaryItem(this.generateCacheKey(_.REQUEST_PARAMS)),!i.authority){const a=this.generateAuthorityKey(e),r=this.getTemporaryCache(a);if(!r)throw A(Li);i.authority=r}return i}getCachedNativeRequest(){this.logger.trace("BrowserCacheManager.getCachedNativeRequest called");const e=this.getTemporaryCache(_.NATIVE_REQUEST,!0);if(!e)return this.logger.trace("BrowserCacheManager.getCachedNativeRequest: No cached native request found"),null;const t=this.validateAndParseJson(e);return t||(this.logger.error("BrowserCacheManager.getCachedNativeRequest: Unable to parse native request"),null)}isInteractionInProgress(e){const t=this.getInteractionInProgress();return e?t===this.clientId:!!t}getInteractionInProgress(){const e=`${f.CACHE_PREFIX}.${_.INTERACTION_STATUS_KEY}`;return this.getTemporaryCache(e,!1)}setInteractionInProgress(e){const t=`${f.CACHE_PREFIX}.${_.INTERACTION_STATUS_KEY}`;if(e){if(this.getInteractionInProgress())throw A(Ur);this.setTemporaryCache(t,this.clientId,!1)}else!e&&this.getInteractionInProgress()===this.clientId&&this.removeTemporaryItem(t)}getLegacyLoginHint(){const e=this.getTemporaryCache(q.ADAL_ID_TOKEN);e&&(this.browserStorage.removeItem(q.ADAL_ID_TOKEN),this.logger.verbose("Cached ADAL id token retrieved."));const t=this.getTemporaryCache(q.ID_TOKEN,!0);t&&(this.browserStorage.removeItem(this.generateCacheKey(q.ID_TOKEN)),this.logger.verbose("Cached MSAL.js v1 id token retrieved"));const i=t||e;if(i){const a=Se(i,le);if(a.preferred_username)return this.logger.verbose("No SSO params used and ADAL/MSAL v1 token retrieved, setting ADAL/MSAL v1 preferred_username as loginHint"),a.preferred_username;if(a.upn)return this.logger.verbose("No SSO params used and ADAL/MSAL v1 token retrieved, setting ADAL/MSAL v1 upn as loginHint"),a.upn;this.logger.verbose("No SSO params used and ADAL/MSAL v1 token retrieved, however, no account hint claim found. Enable preferred_username or upn id token claim to get SSO.")}return null}updateCredentialCacheKey(e,t,i){const a=Oe(t);if(e!==a){const r=this.getItem(e);if(r)return this.browserStorage.removeItem(e),this.setItem(a,r,i),this.logger.verbose(`Updated an outdated ${t.credentialType} cache key`),a;this.logger.error(`Attempted to update an outdated ${t.credentialType} cache key but no item matching the outdated key was found in storage`)}return e}async hydrateCache(e,t){var n,c,l;const i=Et((n=e.account)==null?void 0:n.homeAccountId,(c=e.account)==null?void 0:c.environment,e.idToken,this.clientId,e.tenantId);let a;t.claims&&(a=await this.cryptoImpl.hashString(t.claims));const r=St((l=e.account)==null?void 0:l.homeAccountId,e.account.environment,e.accessToken,this.clientId,e.tenantId,e.scopes.join(" "),e.expiresOn?e.expiresOn.getTime()/1e3:0,e.extExpiresOn?e.extExpiresOn.getTime()/1e3:0,le,void 0,e.tokenType,void 0,t.sshKid,t.claims,a),s={idToken:i,accessToken:r};return this.saveCacheRecord(s,e.correlationId)}async saveCacheRecord(e,t,i){try{await super.saveCacheRecord(e,t,i)}catch(a){if(a instanceof He&&this.performanceClient&&t)try{const r=this.getTokenKeys();this.performanceClient.addFields({cacheRtCount:r.refreshToken.length,cacheIdCount:r.idToken.length,cacheAtCount:r.accessToken.length},t)}catch{}throw a}}}const Cc=(o,e)=>{const t={cacheLocation:Y.MemoryStorage,temporaryCacheLocation:Y.MemoryStorage,storeAuthStateInCookie:!1,secureCookies:!1,cacheMigrationEnabled:!1,claimsBasedCachingEnabled:!1};return new ni(o,t,ft,e)};/*! @azure/msal-browser v3.30.0 2025-08-05 */function wc(o,e,t,i,a){return o.verbose("getAllAccounts called"),t?e.getAllAccounts(i,a):[]}function Ac(o,e,t,i){if(e.trace("getAccount called"),Object.keys(o).length===0)return e.warning("getAccount: No accountFilter provided"),null;const a=t.getAccountInfoFilteredBy(o,i);return a?(e.verbose("getAccount: Account matching provided filter found, returning"),a):(e.verbose("getAccount: No matching account found, returning null"),null)}function Tc(o,e,t,i){if(e.trace("getAccountByUsername called"),!o)return e.warning("getAccountByUsername: No username provided"),null;const a=t.getAccountInfoFilteredBy({username:o},i);return a?(e.verbose("getAccountByUsername: Account matching username found, returning"),e.verbosePii(`getAccountByUsername: Returning signed-in accounts matching username: ${o}`),a):(e.verbose("getAccountByUsername: No matching account found, returning null"),null)}function Ic(o,e,t,i){if(e.trace("getAccountByHomeId called"),!o)return e.warning("getAccountByHomeId: No homeAccountId provided"),null;const a=t.getAccountInfoFilteredBy({homeAccountId:o},i);return a?(e.verbose("getAccountByHomeId: Account matching homeAccountId found, returning"),e.verbosePii(`getAccountByHomeId: Returning signed-in accounts matching homeAccountId: ${o}`),a):(e.verbose("getAccountByHomeId: No matching account found, returning null"),null)}function kc(o,e,t,i){if(e.trace("getAccountByLocalId called"),!o)return e.warning("getAccountByLocalId: No localAccountId provided"),null;const a=t.getAccountInfoFilteredBy({localAccountId:o},i);return a?(e.verbose("getAccountByLocalId: Account matching localAccountId found, returning"),e.verbosePii(`getAccountByLocalId: Returning signed-in accounts matching localAccountId: ${o}`),a):(e.verbose("getAccountByLocalId: No matching account found, returning null"),null)}function Ec(o,e,t){e.setActiveAccount(o,t)}function Sc(o,e){return o.getActiveAccount(e)}/*! @azure/msal-browser v3.30.0 2025-08-05 */const k={INITIALIZE_START:"msal:initializeStart",INITIALIZE_END:"msal:initializeEnd",ACCOUNT_ADDED:"msal:accountAdded",ACCOUNT_REMOVED:"msal:accountRemoved",ACTIVE_ACCOUNT_CHANGED:"msal:activeAccountChanged",LOGIN_START:"msal:loginStart",LOGIN_SUCCESS:"msal:loginSuccess",LOGIN_FAILURE:"msal:loginFailure",ACQUIRE_TOKEN_START:"msal:acquireTokenStart",ACQUIRE_TOKEN_SUCCESS:"msal:acquireTokenSuccess",ACQUIRE_TOKEN_FAILURE:"msal:acquireTokenFailure",ACQUIRE_TOKEN_NETWORK_START:"msal:acquireTokenFromNetworkStart",SSO_SILENT_START:"msal:ssoSilentStart",SSO_SILENT_SUCCESS:"msal:ssoSilentSuccess",SSO_SILENT_FAILURE:"msal:ssoSilentFailure",ACQUIRE_TOKEN_BY_CODE_START:"msal:acquireTokenByCodeStart",ACQUIRE_TOKEN_BY_CODE_SUCCESS:"msal:acquireTokenByCodeSuccess",ACQUIRE_TOKEN_BY_CODE_FAILURE:"msal:acquireTokenByCodeFailure",HANDLE_REDIRECT_START:"msal:handleRedirectStart",HANDLE_REDIRECT_END:"msal:handleRedirectEnd",POPUP_OPENED:"msal:popupOpened",LOGOUT_START:"msal:logoutStart",LOGOUT_SUCCESS:"msal:logoutSuccess",LOGOUT_FAILURE:"msal:logoutFailure",LOGOUT_END:"msal:logoutEnd",RESTORE_FROM_BFCACHE:"msal:restoreFromBFCache"};/*! @azure/msal-browser v3.30.0 2025-08-05 */class Rc{constructor(e){this.eventCallbacks=new Map,this.logger=e||new Ce({})}addEventCallback(e,t,i){if(typeof window<"u"){const a=i||sc();return this.eventCallbacks.has(a)?(this.logger.error(`Event callback with id: ${a} is already registered. Please provide a unique id or remove the existing callback and try again.`),null):(this.eventCallbacks.set(a,[e,t||[]]),this.logger.verbose(`Event callback registered with id: ${a}`),a)}return null}removeEventCallback(e){this.eventCallbacks.delete(e),this.logger.verbose(`Event callback ${e} removed.`)}emitEvent(e,t,i,a){if(typeof window<"u"){const r={eventType:e,interactionType:t||null,payload:i||null,error:a||null,timestamp:Date.now()};this.eventCallbacks.forEach(([s,n],c)=>{(n.length===0||n.includes(e))&&(this.logger.verbose(`Emitting event to callback ${c}: ${e}`),s.apply(null,[r]))})}}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Cs{constructor(e,t,i,a,r,s,n,c,l){this.config=e,this.browserStorage=t,this.browserCrypto=i,this.networkClient=this.config.system.networkClient,this.eventHandler=r,this.navigationClient=s,this.nativeMessageHandler=c,this.correlationId=l||ue(),this.logger=a.clone(Q.MSAL_SKU,Fe,this.correlationId),this.performanceClient=n}async clearCacheOnLogout(e){if(e){z.accountInfoIsEqual(e,this.browserStorage.getActiveAccount(this.correlationId),!1)&&(this.logger.verbose("Setting active account to null"),this.browserStorage.setActiveAccount(null,this.correlationId));try{await this.browserStorage.removeAccount(z.generateAccountCacheKey(e),this.correlationId),this.logger.verbose("Cleared cache items belonging to the account provided in the logout request.")}catch{this.logger.error("Account provided in logout request was not found. Local cache unchanged.")}}else try{this.logger.verbose("No account provided in logout request, clearing all cache items.",this.correlationId),await this.browserStorage.clear(this.correlationId),await this.browserCrypto.clearKeystore()}catch{this.logger.error("Attempted to clear all MSAL cache items and failed. Local cache unchanged.")}}getRedirectUri(e){this.logger.verbose("getRedirectUri called");const t=e||this.config.auth.redirectUri;return x.getAbsoluteUrl(t,fe())}initializeServerTelemetryManager(e,t){this.logger.verbose("initializeServerTelemetryManager called");const i={clientId:this.config.auth.clientId,correlationId:this.correlationId,apiId:e,forceRefresh:t||!1,wrapperSKU:this.browserStorage.getWrapperMetadata()[0],wrapperVer:this.browserStorage.getWrapperMetadata()[1]};return new et(i,this.browserStorage)}async getDiscoveredAuthority(e){const{account:t}=e,i=e.requestExtraQueryParameters&&e.requestExtraQueryParameters.hasOwnProperty("instance_aware")?e.requestExtraQueryParameters.instance_aware:void 0;this.performanceClient.addQueueMeasurement(g.StandardInteractionClientGetDiscoveredAuthority,this.correlationId);const a={protocolMode:this.config.auth.protocolMode,OIDCOptions:this.config.auth.OIDCOptions,knownAuthorities:this.config.auth.knownAuthorities,cloudDiscoveryMetadata:this.config.auth.cloudDiscoveryMetadata,authorityMetadata:this.config.auth.authorityMetadata,skipAuthorityMetadataCache:this.config.auth.skipAuthorityMetadataCache},r=e.requestAuthority||this.config.auth.authority,s=i!=null&&i.length?i==="true":this.config.auth.instanceAware,n=t&&s?this.config.auth.authority.replace(x.getDomainFromUrl(r),t.environment):r,c=G.generateAuthority(n,e.requestAzureCloudOptions||this.config.auth.azureCloudOptions),l=await b(Rr,g.AuthorityFactoryCreateDiscoveredInstance,this.logger,this.performanceClient,this.correlationId)(c,this.config.system.networkClient,this.browserStorage,a,this.logger,this.correlationId,this.performanceClient);if(t&&!l.isAlias(t.environment))throw O(yr);return l}}/*! @azure/msal-browser v3.30.0 2025-08-05 */const xc=32;async function Pc(o,e,t){o.addQueueMeasurement(g.GeneratePkceCodes,t);const i=Re(_c,g.GenerateCodeVerifier,e,o,t)(o,e,t),a=await b(Mc,g.GenerateCodeChallengeFromVerifier,e,o,t)(i,o,e,t);return{verifier:i,challenge:a}}function _c(o,e,t){try{const i=new Uint8Array(xc);return Re(jo,g.GetRandomValues,e,o,t)(i),$t(i)}catch{throw A($i)}}async function Mc(o,e,t,i){e.addQueueMeasurement(g.GenerateCodeChallengeFromVerifier,i);try{const a=await b(ps,g.Sha256Digest,t,e,i)(o,e,i);return $t(new Uint8Array(a))}catch{throw A($i)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */async function Yi(o,e,t,i){t.addQueueMeasurement(g.InitializeBaseRequest,o.correlationId);const a=o.authority||e.auth.authority,r=[...o&&o.scopes||[]],s={...o,correlationId:o.correlationId,authority:a,scopes:r};if(!s.authenticationScheme)s.authenticationScheme=M.BEARER,i.verbose(`Authentication Scheme wasn't explicitly set in request, defaulting to "Bearer" request`);else{if(s.authenticationScheme===M.SSH){if(!o.sshJwk)throw O(Rt);if(!o.sshKid)throw O(mr)}i.verbose(`Authentication Scheme set to "${s.authenticationScheme}" as configured in Auth request`)}return e.cache.claimsBasedCachingEnabled&&o.claims&&!ie.isEmptyObj(o.claims)&&(s.requestedClaimsHash=await gs(o.claims)),s}async function Nc(o,e,t,i,a){i.addQueueMeasurement(g.InitializeSilentRequest,o.correlationId);const r=await b(Yi,g.InitializeBaseRequest,a,i,o.correlationId)(o,t,i,a);return{...o,...r,account:e,forceRefresh:o.forceRefresh||!1}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Ke extends Cs{async initializeAuthorizationCodeRequest(e){this.performanceClient.addQueueMeasurement(g.StandardInteractionClientInitializeAuthorizationCodeRequest,this.correlationId);const t=await b(Pc,g.GeneratePkceCodes,this.logger,this.performanceClient,this.correlationId)(this.performanceClient,this.logger,this.correlationId),i={...e,redirectUri:e.redirectUri,code:f.EMPTY_STRING,codeVerifier:t.verifier};return e.codeChallenge=t.challenge,e.codeChallengeMethod=f.S256_CODE_CHALLENGE_METHOD,i}initializeLogoutRequest(e){this.logger.verbose("initializeLogoutRequest called",e==null?void 0:e.correlationId);const t={correlationId:this.correlationId||ue(),...e};if(e)if(e.logoutHint)this.logger.verbose("logoutHint has already been set in logoutRequest");else if(e.account){const i=this.getLogoutHintFromIdTokenClaims(e.account);i&&(this.logger.verbose("Setting logoutHint to login_hint ID Token Claim value for the account provided"),t.logoutHint=i)}else this.logger.verbose("logoutHint was not set and account was not passed into logout request, logoutHint will not be set");else this.logger.verbose("logoutHint will not be set since no logout request was configured");return!e||e.postLogoutRedirectUri!==null?e&&e.postLogoutRedirectUri?(this.logger.verbose("Setting postLogoutRedirectUri to uri set on logout request",t.correlationId),t.postLogoutRedirectUri=x.getAbsoluteUrl(e.postLogoutRedirectUri,fe())):this.config.auth.postLogoutRedirectUri===null?this.logger.verbose("postLogoutRedirectUri configured as null and no uri set on request, not passing post logout redirect",t.correlationId):this.config.auth.postLogoutRedirectUri?(this.logger.verbose("Setting postLogoutRedirectUri to configured uri",t.correlationId),t.postLogoutRedirectUri=x.getAbsoluteUrl(this.config.auth.postLogoutRedirectUri,fe())):(this.logger.verbose("Setting postLogoutRedirectUri to current page",t.correlationId),t.postLogoutRedirectUri=x.getAbsoluteUrl(fe(),fe())):this.logger.verbose("postLogoutRedirectUri passed as null, not setting post logout redirect uri",t.correlationId),t}getLogoutHintFromIdTokenClaims(e){const t=e.idTokenClaims;if(t){if(t.login_hint)return t.login_hint;this.logger.verbose("The ID Token Claims tied to the provided account do not contain a login_hint claim, logoutHint will not be added to logout request")}else this.logger.verbose("The provided account does not contain ID Token Claims, logoutHint will not be added to logout request");return null}async createAuthCodeClient(e){this.performanceClient.addQueueMeasurement(g.StandardInteractionClientCreateAuthCodeClient,this.correlationId);const t=await b(this.getClientConfiguration.bind(this),g.StandardInteractionClientGetClientConfiguration,this.logger,this.performanceClient,this.correlationId)(e);return new _r(t,this.performanceClient)}async getClientConfiguration(e){const{serverTelemetryManager:t,requestAuthority:i,requestAzureCloudOptions:a,requestExtraQueryParameters:r,account:s}=e;this.performanceClient.addQueueMeasurement(g.StandardInteractionClientGetClientConfiguration,this.correlationId);const n=await b(this.getDiscoveredAuthority.bind(this),g.StandardInteractionClientGetDiscoveredAuthority,this.logger,this.performanceClient,this.correlationId)({requestAuthority:i,requestAzureCloudOptions:a,requestExtraQueryParameters:r,account:s}),c=this.config.system.loggerOptions;return{authOptions:{clientId:this.config.auth.clientId,authority:n,clientCapabilities:this.config.auth.clientCapabilities,redirectUri:this.config.auth.redirectUri},systemOptions:{tokenRenewalOffsetSeconds:this.config.system.tokenRenewalOffsetSeconds,preventCorsPreflight:!0},loggerOptions:{loggerCallback:c.loggerCallback,piiLoggingEnabled:c.piiLoggingEnabled,logLevel:c.logLevel,correlationId:this.correlationId},cacheOptions:{claimsBasedCachingEnabled:this.config.cache.claimsBasedCachingEnabled},cryptoInterface:this.browserCrypto,networkInterface:this.networkClient,storageInterface:this.browserStorage,serverTelemetryManager:t,libraryInfo:{sku:Q.MSAL_SKU,version:Fe,cpu:f.EMPTY_STRING,os:f.EMPTY_STRING},telemetry:this.config.telemetry}}async initializeAuthorizationRequest(e,t){this.performanceClient.addQueueMeasurement(g.StandardInteractionClientInitializeAuthorizationRequest,this.correlationId);const i=this.getRedirectUri(e.redirectUri),a={interactionType:t},r=ae.setRequestState(this.browserCrypto,e&&e.state||f.EMPTY_STRING,a),n={...await b(Yi,g.InitializeBaseRequest,this.logger,this.performanceClient,this.correlationId)({...e,correlationId:this.correlationId},this.config,this.performanceClient,this.logger),redirectUri:i,state:r,nonce:e.nonce||ue(),responseMode:this.config.auth.OIDCOptions.serverResponseType};if(e.loginHint||e.sid)return n;const c=e.account||this.browserStorage.getActiveAccount(this.correlationId);if(c&&(this.logger.verbose("Setting validated request account",this.correlationId),this.logger.verbosePii(`Setting validated request account: ${c.homeAccountId}`,this.correlationId),n.account=c),!n.loginHint&&!c){const l=this.browserStorage.getLegacyLoginHint();l&&(n.loginHint=l)}return n}}/*! @azure/msal-browser v3.30.0 2025-08-05 */const Oc="ContentError",ws="user_switch";/*! @azure/msal-browser v3.30.0 2025-08-05 */const $c="USER_INTERACTION_REQUIRED",Dc="USER_CANCEL",Lc="NO_NETWORK",Hc="PERSISTENT_ERROR",Uc="DISABLED",zc="ACCOUNT_UNAVAILABLE";/*! @azure/msal-browser v3.30.0 2025-08-05 */const qc=-2147186943,Fc={[ws]:"User attempted to switch accounts in the native broker, which is not allowed. All new accounts must sign-in through the standard web flow first, please try again."};class oe extends D{constructor(e,t,i){super(e,t),Object.setPrototypeOf(this,oe.prototype),this.name="NativeAuthError",this.ext=i}}function Ne(o){if(o.ext&&o.ext.status&&(o.ext.status===Hc||o.ext.status===Uc)||o.ext&&o.ext.error&&o.ext.error===qc)return!0;switch(o.errorCode){case Oc:return!0;default:return!1}}function oi(o,e,t){if(t&&t.status)switch(t.status){case zc:return Zt(xr);case $c:return new ee(o,e);case Dc:return A(ke);case Lc:return A(Tt)}return new oe(o,Fc[o]||e,t)}/*! @azure/msal-browser v3.30.0 2025-08-05 */class As extends Ke{async acquireToken(e){this.performanceClient.addQueueMeasurement(g.SilentCacheClientAcquireToken,e.correlationId);const t=this.initializeServerTelemetryManager($.acquireTokenSilent_silentFlow),i=await b(this.getClientConfiguration.bind(this),g.StandardInteractionClientGetClientConfiguration,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:t,requestAuthority:e.authority,requestAzureCloudOptions:e.azureCloudOptions,account:e.account}),a=new Io(i,this.performanceClient);this.logger.verbose("Silent auth client created");try{const s=(await b(a.acquireCachedToken.bind(a),g.SilentFlowClientAcquireCachedToken,this.logger,this.performanceClient,e.correlationId)(e))[0];return this.performanceClient.addFields({fromCache:!0},e.correlationId),s}catch(r){throw r instanceof at&&r.errorCode===Hi&&this.logger.verbose("Signing keypair for bound access token not found. Refreshing bound access token and generating a new crypto keypair."),r}}logout(e){this.logger.verbose("logoutRedirect called");const t=this.initializeLogoutRequest(e);return this.clearCacheOnLogout(t==null?void 0:t.account)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Ue extends Cs{constructor(e,t,i,a,r,s,n,c,l,d,u,p){var m;super(e,t,i,a,r,s,c,l,p),this.apiId=n,this.accountId=d,this.nativeMessageHandler=l,this.nativeStorageManager=u,this.silentCacheClient=new As(e,this.nativeStorageManager,i,a,r,s,c,l,p),this.serverTelemetryManager=this.initializeServerTelemetryManager(this.apiId);const h=this.nativeMessageHandler.getExtensionId()===De.PREFERRED_EXTENSION_ID?"chrome":(m=this.nativeMessageHandler.getExtensionId())!=null&&m.length?"unknown":void 0;this.skus=et.makeExtraSkuString({libraryName:Q.MSAL_SKU,libraryVersion:Fe,extensionName:h,extensionVersion:this.nativeMessageHandler.getExtensionVersion()})}addRequestSKUs(e){e.extraParameters={...e.extraParameters,[no]:this.skus}}async acquireToken(e){this.performanceClient.addQueueMeasurement(g.NativeInteractionClientAcquireToken,e.correlationId),this.logger.trace("NativeInteractionClient - acquireToken called.");const t=this.performanceClient.startMeasurement(g.NativeInteractionClientAcquireToken,e.correlationId),i=de();try{const a=await this.initializeNativeRequest(e);try{const l=await this.acquireTokensFromCache(this.accountId,a);return t.end({success:!0,isNativeBroker:!1,fromCache:!0}),l}catch{this.logger.info("MSAL internal Cache does not contain tokens, proceed to make a native call")}const{...r}=a,s={method:Ae.GetToken,request:r},n=await this.nativeMessageHandler.sendMessage(s),c=this.validateNativeResponse(n);return await this.handleNativeResponse(c,a,i).then(l=>(t.end({success:!0,isNativeBroker:!0,requestId:l.requestId}),this.serverTelemetryManager.clearNativeBrokerErrorCode(),l)).catch(l=>{throw t.end({success:!1,errorCode:l.errorCode,subErrorCode:l.subError,isNativeBroker:!0}),l})}catch(a){throw a instanceof oe&&this.serverTelemetryManager.setNativeBrokerErrorCode(a.errorCode),a}}createSilentCacheRequest(e,t){return{authority:e.authority,correlationId:this.correlationId,scopes:U.fromString(e.scope).asArray(),account:t,forceRefresh:!1}}async acquireTokensFromCache(e,t){if(!e)throw this.logger.warning("NativeInteractionClient:acquireTokensFromCache - No nativeAccountId provided"),y(Vt);const i=this.browserStorage.getBaseAccountInfo({nativeAccountId:e},t.correlationId);if(!i)throw y(Vt);try{const a=this.createSilentCacheRequest(t,i),r=await this.silentCacheClient.acquireToken(a),s={...i,idTokenClaims:r==null?void 0:r.idTokenClaims,idToken:r==null?void 0:r.idToken};return{...r,account:s}}catch(a){throw a}}async acquireTokenRedirect(e,t){this.logger.trace("NativeInteractionClient - acquireTokenRedirect called.");const{...i}=e;delete i.onRedirectNavigate;const a=await this.initializeNativeRequest(i),r={method:Ae.GetToken,request:a};try{const c=await this.nativeMessageHandler.sendMessage(r);this.validateNativeResponse(c)}catch(c){if(c instanceof oe&&(this.serverTelemetryManager.setNativeBrokerErrorCode(c.errorCode),Ne(c)))throw c}this.browserStorage.setTemporaryCache(_.NATIVE_REQUEST,JSON.stringify(a),!0);const s={apiId:$.acquireTokenRedirect,timeout:this.config.system.redirectNavigationTimeout,noHistory:!1},n=this.config.auth.navigateToLoginRequestUrl?window.location.href:this.getRedirectUri(e.redirectUri);t.end({success:!0}),await this.navigationClient.navigateExternal(n,s)}async handleRedirectPromise(e,t){if(this.logger.trace("NativeInteractionClient - handleRedirectPromise called."),!this.browserStorage.isInteractionInProgress(!0))return this.logger.info("handleRedirectPromise called but there is no interaction in progress, returning null."),null;const i=this.browserStorage.getCachedNativeRequest();if(!i)return this.logger.verbose("NativeInteractionClient - handleRedirectPromise called but there is no cached request, returning null."),e&&t&&(e==null||e.addFields({errorCode:"no_cached_request"},t)),null;const{prompt:a,...r}=i;a&&this.logger.verbose("NativeInteractionClient - handleRedirectPromise called and prompt was included in the original request, removing prompt from cached request to prevent second interaction with native broker window."),this.browserStorage.removeItem(this.browserStorage.generateCacheKey(_.NATIVE_REQUEST));const s={method:Ae.GetToken,request:r},n=de();try{this.logger.verbose("NativeInteractionClient - handleRedirectPromise sending message to native broker.");const c=await this.nativeMessageHandler.sendMessage(s);this.validateNativeResponse(c);const l=this.handleNativeResponse(c,r,n);this.browserStorage.setInteractionInProgress(!1);const d=await l;return this.serverTelemetryManager.clearNativeBrokerErrorCode(),d}catch(c){throw this.browserStorage.setInteractionInProgress(!1),c}}logout(){return this.logger.trace("NativeInteractionClient - logout called."),Promise.reject("Logout not implemented yet")}async handleNativeResponse(e,t,i){var d;this.logger.trace("NativeInteractionClient - handleNativeResponse called.");const a=Se(e.id_token,le),r=this.createHomeAccountIdentifier(e,a),s=(d=this.browserStorage.getAccountInfoFilteredBy({nativeAccountId:t.accountId},this.correlationId))==null?void 0:d.homeAccountId;if(r!==s&&e.account.id!==t.accountId)throw oi(ws);const n=await this.getDiscoveredAuthority({requestAuthority:t.authority}),c=Mi(this.browserStorage,n,r,le,this.correlationId,a,e.client_info,void 0,a.tid,void 0,e.account.id,this.logger),l=await this.generateAuthenticationResult(e,t,a,c,n.canonicalAuthority,i);return this.cacheAccount(c),this.cacheNativeTokens(e,t,r,a,e.access_token,l.tenantId,i),l}createHomeAccountIdentifier(e,t){return z.generateHomeAccountId(e.client_info||f.EMPTY_STRING,te.Default,this.logger,this.browserCrypto,t)}generateScopes(e,t){return e.scope?U.fromString(e.scope):U.fromString(t.scope)}async generatePopAccessToken(e,t){if(t.tokenType===M.POP&&t.signPopToken){if(e.shr)return this.logger.trace("handleNativeServerResponse: SHR is enabled in native layer"),e.shr;const i=new qe(this.browserCrypto),a={resourceRequestMethod:t.resourceRequestMethod,resourceRequestUri:t.resourceRequestUri,shrClaims:t.shrClaims,shrNonce:t.shrNonce};if(!t.keyId)throw y(fi);return i.signPopToken(e.access_token,t.keyId,a)}else return e.access_token}async generateAuthenticationResult(e,t,i,a,r,s){const n=this.addTelemetryFromNativeResponse(e),c=e.scope?U.fromString(e.scope):U.fromString(t.scope),l=e.account.properties||{},d=l.UID||i.oid||i.sub||f.EMPTY_STRING,u=l.TenantId||i.tid||f.EMPTY_STRING,p=ki(a.getAccountInfo(),void 0,i,e.id_token);p.nativeAccountId!==e.account.id&&(p.nativeAccountId=e.account.id);const h=await this.generatePopAccessToken(e,t),m=t.tokenType===M.POP?M.POP:M.BEARER;return{authority:r,uniqueId:d,tenantId:u,scopes:c.asArray(),account:p,idToken:e.id_token,idTokenClaims:i,accessToken:h,fromCache:n?this.isResponseFromCache(n):!1,expiresOn:new Date(Number(s+e.expires_in)*1e3),tokenType:m,correlationId:this.correlationId,state:e.state,fromNativeBroker:!0}}cacheAccount(e){this.browserStorage.setAccount(e,this.correlationId),this.browserStorage.removeAccountContext(e,this.correlationId).catch(t=>{this.logger.error(`Error occurred while removing account context from browser storage. ${t}`)})}cacheNativeTokens(e,t,i,a,r,s,n){const c=Et(i,t.authority,e.id_token||"",t.clientId,a.tid||""),l=t.tokenType===M.POP?f.SHR_NONCE_VALIDITY:(typeof e.expires_in=="string"?parseInt(e.expires_in,10):e.expires_in)||0,d=n+l,u=this.generateScopes(e,t),p=St(i,t.authority,r,t.clientId,a.tid||s,u.printScopes(),d,0,le,void 0,t.tokenType,void 0,t.keyId),h={idToken:c,accessToken:p};this.nativeStorageManager.saveCacheRecord(h,t.correlationId,t.storeInCache)}addTelemetryFromNativeResponse(e){const t=this.getMATSFromResponse(e);return t?(this.performanceClient.addFields({extensionId:this.nativeMessageHandler.getExtensionId(),extensionVersion:this.nativeMessageHandler.getExtensionVersion(),matsBrokerVersion:t.broker_version,matsAccountJoinOnStart:t.account_join_on_start,matsAccountJoinOnEnd:t.account_join_on_end,matsDeviceJoin:t.device_join,matsPromptBehavior:t.prompt_behavior,matsApiErrorCode:t.api_error_code,matsUiVisible:t.ui_visible,matsSilentCode:t.silent_code,matsSilentBiSubCode:t.silent_bi_sub_code,matsSilentMessage:t.silent_message,matsSilentStatus:t.silent_status,matsHttpStatus:t.http_status,matsHttpEventCount:t.http_event_count},this.correlationId),t):null}validateNativeResponse(e){if(e.hasOwnProperty("access_token")&&e.hasOwnProperty("id_token")&&e.hasOwnProperty("client_info")&&e.hasOwnProperty("account")&&e.hasOwnProperty("scope")&&e.hasOwnProperty("expires_in"))return e;throw Ua(di,"Response missing expected properties.")}getMATSFromResponse(e){if(e.properties.MATS)try{return JSON.parse(e.properties.MATS)}catch{this.logger.error("NativeInteractionClient - Error parsing MATS telemetry, returning null instead")}return null}isResponseFromCache(e){return typeof e.is_cached>"u"?(this.logger.verbose("NativeInteractionClient - MATS telemetry does not contain field indicating if response was served from cache. Returning false."),!1):!!e.is_cached}async initializeNativeRequest(e){this.logger.trace("NativeInteractionClient - initializeNativeRequest called");const t=e.authority||this.config.auth.authority;e.account&&await this.getDiscoveredAuthority({requestAuthority:t,requestAzureCloudOptions:e.azureCloudOptions,account:e.account});const i=new x(t);i.validateAsUri();const{scopes:a,...r}=e,s=new U(a||[]);s.appendScopes(Ge);const n=()=>{switch(this.apiId){case $.ssoSilent:case $.acquireTokenSilent_silentFlow:return this.logger.trace("initializeNativeRequest: silent request sets prompt to none"),F.NONE}if(!e.prompt){this.logger.trace("initializeNativeRequest: prompt was not provided");return}switch(e.prompt){case F.NONE:case F.CONSENT:case F.LOGIN:return this.logger.trace("initializeNativeRequest: prompt is compatible with native flow"),e.prompt;default:throw this.logger.trace(`initializeNativeRequest: prompt = ${e.prompt} is not compatible with native flow`),A(ss)}},c={...r,accountId:this.accountId,clientId:this.config.auth.clientId,authority:i.urlString,scope:s.printScopes(),redirectUri:this.getRedirectUri(e.redirectUri),prompt:n(),correlationId:this.correlationId,tokenType:e.authenticationScheme,windowTitleSubstring:document.title,extraParameters:{...e.extraQueryParameters,...e.tokenQueryParameters},extendedExpiryToken:!1,keyId:e.popKid};if(c.signPopToken&&e.popKid)throw A(os);if(this.handleExtraBrokerParams(c),c.extraParameters=c.extraParameters||{},c.extraParameters.telemetry=De.MATS_TELEMETRY,e.authenticationScheme===M.POP){const l={resourceRequestUri:e.resourceRequestUri,resourceRequestMethod:e.resourceRequestMethod,shrClaims:e.shrClaims,shrNonce:e.shrNonce},d=new qe(this.browserCrypto);let u;if(c.keyId)u=this.browserCrypto.base64UrlEncode(JSON.stringify({kid:c.keyId})),c.signPopToken=!1;else{const p=await b(d.generateCnf.bind(d),g.PopTokenGenerateCnf,this.logger,this.performanceClient,e.correlationId)(l,this.logger);u=p.reqCnfString,c.keyId=p.kid,c.signPopToken=!0}c.reqCnf=u}return this.addRequestSKUs(c),c}handleExtraBrokerParams(e){var r;const t=e.extraParameters&&e.extraParameters.hasOwnProperty(xi)&&e.extraParameters.hasOwnProperty(Xt)&&e.extraParameters.hasOwnProperty(Te);if(!e.embeddedClientId&&!t)return;let i="";const a=e.redirectUri;e.embeddedClientId?(e.redirectUri=this.config.auth.redirectUri,i=e.embeddedClientId):e.extraParameters&&(e.redirectUri=e.extraParameters[Xt],i=e.extraParameters[Te]),e.extraParameters={child_client_id:i,child_redirect_uri:a},(r=this.performanceClient)==null||r.addFields({embeddedClientId:i,embeddedRedirectUri:a},e.correlationId)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class ce{constructor(e,t,i,a){this.logger=e,this.handshakeTimeoutMs=t,this.extensionId=a,this.resolvers=new Map,this.handshakeResolvers=new Map,this.messageChannel=new MessageChannel,this.windowListener=this.onWindowMessage.bind(this),this.performanceClient=i,this.handshakeEvent=i.startMeasurement(g.NativeMessageHandlerHandshake)}async sendMessage(e){this.logger.trace("NativeMessageHandler - sendMessage called.");const t={channel:De.CHANNEL_ID,extensionId:this.extensionId,responseId:ue(),body:e};return this.logger.trace("NativeMessageHandler - Sending request to browser extension"),this.logger.tracePii(`NativeMessageHandler - Sending request to browser extension: ${JSON.stringify(t)}`),this.messageChannel.port1.postMessage(t),new Promise((i,a)=>{this.resolvers.set(t.responseId,{resolve:i,reject:a})})}static async createProvider(e,t,i){e.trace("NativeMessageHandler - createProvider called.");try{const a=new ce(e,t,i,De.PREFERRED_EXTENSION_ID);return await a.sendHandshakeRequest(),a}catch{const r=new ce(e,t,i);return await r.sendHandshakeRequest(),r}}async sendHandshakeRequest(){this.logger.trace("NativeMessageHandler - sendHandshakeRequest called."),window.addEventListener("message",this.windowListener,!1);const e={channel:De.CHANNEL_ID,extensionId:this.extensionId,responseId:ue(),body:{method:Ae.HandshakeRequest}};return this.handshakeEvent.add({extensionId:this.extensionId,extensionHandshakeTimeoutMs:this.handshakeTimeoutMs}),this.messageChannel.port1.onmessage=t=>{this.onChannelMessage(t)},window.postMessage(e,window.origin,[this.messageChannel.port2]),new Promise((t,i)=>{this.handshakeResolvers.set(e.responseId,{resolve:t,reject:i}),this.timeoutId=window.setTimeout(()=>{window.removeEventListener("message",this.windowListener,!1),this.messageChannel.port1.close(),this.messageChannel.port2.close(),this.handshakeEvent.end({extensionHandshakeTimedOut:!0,success:!1}),i(A(is)),this.handshakeResolvers.delete(e.responseId)},this.handshakeTimeoutMs)})}onWindowMessage(e){if(this.logger.trace("NativeMessageHandler - onWindowMessage called"),e.source!==window)return;const t=e.data;if(!(!t.channel||t.channel!==De.CHANNEL_ID)&&!(t.extensionId&&t.extensionId!==this.extensionId)&&t.body.method===Ae.HandshakeRequest){const i=this.handshakeResolvers.get(t.responseId);if(!i){this.logger.trace(`NativeMessageHandler.onWindowMessage - resolver can't be found for request ${t.responseId}`);return}this.logger.verbose(t.extensionId?`Extension with id: ${t.extensionId} not installed`:"No extension installed"),clearTimeout(this.timeoutId),this.messageChannel.port1.close(),this.messageChannel.port2.close(),window.removeEventListener("message",this.windowListener,!1),this.handshakeEvent.end({success:!1,extensionInstalled:!1}),i.reject(A(as))}}onChannelMessage(e){this.logger.trace("NativeMessageHandler - onChannelMessage called.");const t=e.data,i=this.resolvers.get(t.responseId),a=this.handshakeResolvers.get(t.responseId);try{const r=t.body.method;if(r===Ae.Response){if(!i)return;const s=t.body.response;if(this.logger.trace("NativeMessageHandler - Received response from browser extension"),this.logger.tracePii(`NativeMessageHandler - Received response from browser extension: ${JSON.stringify(s)}`),s.status!=="Success")i.reject(oi(s.code,s.description,s.ext));else if(s.result)s.result.code&&s.result.description?i.reject(oi(s.result.code,s.result.description,s.result.ext)):i.resolve(s.result);else throw Ua(di,"Event does not contain result.");this.resolvers.delete(t.responseId)}else if(r===Ae.HandshakeResponse){if(!a){this.logger.trace(`NativeMessageHandler.onChannelMessage - resolver can't be found for request ${t.responseId}`);return}clearTimeout(this.timeoutId),window.removeEventListener("message",this.windowListener,!1),this.extensionId=t.extensionId,this.extensionVersion=t.body.version,this.logger.verbose(`NativeMessageHandler - Received HandshakeResponse from extension: ${this.extensionId}`),this.handshakeEvent.end({extensionInstalled:!0,success:!0}),a.resolve(),this.handshakeResolvers.delete(t.responseId)}}catch(r){this.logger.error("Error parsing response from WAM Extension"),this.logger.errorPii(`Error parsing response from WAM Extension: ${r}`),this.logger.errorPii(`Unable to parse ${e}`),i?i.reject(r):a&&a.reject(r)}}getExtensionId(){return this.extensionId}getExtensionVersion(){return this.extensionVersion}static isNativeAvailable(e,t,i,a){if(t.trace("isNativeAvailable called"),!e.system.allowNativeBroker)return t.trace("isNativeAvailable: allowNativeBroker is not enabled, returning false"),!1;if(!i)return t.trace("isNativeAvailable: WAM extension provider is not initialized, returning false"),!1;if(a)switch(a){case M.BEARER:case M.POP:return t.trace("isNativeAvailable: authenticationScheme is supported, returning true"),!0;default:return t.trace("isNativeAvailable: authenticationScheme is not supported, returning false"),!1}return!0}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Wi{constructor(e,t,i,a,r){this.authModule=e,this.browserStorage=t,this.authCodeRequest=i,this.logger=a,this.performanceClient=r}async handleCodeResponse(e,t){this.performanceClient.addQueueMeasurement(g.HandleCodeResponse,t.correlationId);let i;try{i=this.authModule.handleFragmentResponse(e,t.state)}catch(a){throw a instanceof we&&a.subError===ke?A(ke):a}return b(this.handleCodeResponseFromServer.bind(this),g.HandleCodeResponseFromServer,this.logger,this.performanceClient,t.correlationId)(i,t)}async handleCodeResponseFromServer(e,t,i=!0){if(this.performanceClient.addQueueMeasurement(g.HandleCodeResponseFromServer,t.correlationId),this.logger.trace("InteractionHandler.handleCodeResponseFromServer called"),this.authCodeRequest.code=e.code,e.cloud_instance_host_name&&await b(this.authModule.updateAuthority.bind(this.authModule),g.UpdateTokenEndpointAuthority,this.logger,this.performanceClient,t.correlationId)(e.cloud_instance_host_name,t.correlationId),i&&(e.nonce=t.nonce||void 0),e.state=t.state,e.client_info)this.authCodeRequest.clientInfo=e.client_info;else{const r=this.createCcsCredentials(t);r&&(this.authCodeRequest.ccsCredential=r)}return await b(this.authModule.acquireToken.bind(this.authModule),g.AuthClientAcquireToken,this.logger,this.performanceClient,t.correlationId)(this.authCodeRequest,e)}createCcsCredentials(e){return e.account?{credential:e.account.homeAccountId,type:X.HOME_ACCOUNT_ID}:e.loginHint?{credential:e.loginHint,type:X.UPN}:null}}/*! @azure/msal-browser v3.30.0 2025-08-05 */function Ts(o,e,t){const i=bt(o);if(!i)throw Cr(o)?(t.error(`A ${e} is present in the iframe but it does not contain known properties. It's likely that the ${e} has been replaced by code running on the redirectUri page.`),t.errorPii(`The ${e} detected is: ${o}`),A(Dr)):(t.error(`The request has returned to the redirectUri but a ${e} is not present. It's likely that the ${e} has been removed or the page has been redirected by code running on the redirectUri page.`),A($r));return i}function Bc(o,e,t){if(!o.state)throw A(Di);const i=bs(e,o.state);if(!i)throw A(Lr);if(i.interactionType!==t)throw A(Hr)}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Gc extends Ke{constructor(e,t,i,a,r,s,n,c,l,d){super(e,t,i,a,r,s,n,l,d),this.unloadWindow=this.unloadWindow.bind(this),this.nativeStorage=c}acquireToken(e){try{const i={popupName:this.generatePopupName(e.scopes||Ge,e.authority||this.config.auth.authority),popupWindowAttributes:e.popupWindowAttributes||{},popupWindowParent:e.popupWindowParent??window};return this.config.system.asyncPopups?(this.logger.verbose("asyncPopups set to true, acquiring token"),this.acquireTokenPopupAsync(e,i)):(this.logger.verbose("asyncPopup set to false, opening popup before acquiring token"),i.popup=this.openSizedPopup("about:blank",i),this.acquireTokenPopupAsync(e,i))}catch(t){return Promise.reject(t)}}logout(e){try{this.logger.verbose("logoutPopup called");const t=this.initializeLogoutRequest(e),i={popupName:this.generateLogoutPopupName(t),popupWindowAttributes:(e==null?void 0:e.popupWindowAttributes)||{},popupWindowParent:(e==null?void 0:e.popupWindowParent)??window},a=e&&e.authority,r=e&&e.mainWindowRedirectUri;return this.config.system.asyncPopups?(this.logger.verbose("asyncPopups set to true"),this.logoutPopupAsync(t,i,a,r)):(this.logger.verbose("asyncPopup set to false, opening popup"),i.popup=this.openSizedPopup("about:blank",i),this.logoutPopupAsync(t,i,a,r))}catch(t){return Promise.reject(t)}}async acquireTokenPopupAsync(e,t){var r;this.logger.verbose("acquireTokenPopupAsync called");const i=this.initializeServerTelemetryManager($.acquireTokenPopup),a=await b(this.initializeAuthorizationRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationRequest,this.logger,this.performanceClient,this.correlationId)(e,I.Popup);ys(a.authority);try{const s=await b(this.initializeAuthorizationCodeRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationCodeRequest,this.logger,this.performanceClient,this.correlationId)(a),n=await b(this.createAuthCodeClient.bind(this),g.StandardInteractionClientCreateAuthCodeClient,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:i,requestAuthority:a.authority,requestAzureCloudOptions:a.azureCloudOptions,requestExtraQueryParameters:a.extraQueryParameters,account:a.account}),c=ce.isNativeAvailable(this.config,this.logger,this.nativeMessageHandler,e.authenticationScheme);let l;c&&(l=this.performanceClient.startMeasurement(g.FetchAccountIdWithNativeBroker,e.correlationId));const d=await n.getAuthCodeUrl({...a,nativeBroker:c}),u=new Wi(n,this.browserStorage,s,this.logger,this.performanceClient),p=this.initiateAuthRequest(d,t);this.eventHandler.emitEvent(k.POPUP_OPENED,I.Popup,{popupWindow:p},null);const h=await this.monitorPopupForHash(p,t.popupWindowParent),m=Re(Ts,g.DeserializeResponse,this.logger,this.performanceClient,this.correlationId)(h,this.config.auth.OIDCOptions.serverResponseType,this.logger);if(ne.removeThrottle(this.browserStorage,this.config.auth.clientId,s),m.accountId){if(this.logger.verbose("Account id found in hash, calling WAM for token"),l&&l.end({success:!0,isNativeBroker:!0}),!this.nativeMessageHandler)throw A(it);const w=new Ue(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,$.acquireTokenPopup,this.performanceClient,this.nativeMessageHandler,m.accountId,this.nativeStorage,a.correlationId),{userRequestState:C}=ae.parseRequestState(this.browserCrypto,a.state);return await w.acquireToken({...a,state:C,prompt:void 0})}return await u.handleCodeResponse(m,a)}catch(s){throw(r=t.popup)==null||r.close(),s instanceof D&&(s.setCorrelationId(this.correlationId),i.cacheFailedRequest(s)),s}}async logoutPopupAsync(e,t,i,a){var s,n,c,l;this.logger.verbose("logoutPopupAsync called"),this.eventHandler.emitEvent(k.LOGOUT_START,I.Popup,e);const r=this.initializeServerTelemetryManager($.logoutPopup);try{await this.clearCacheOnLogout(e.account);const d=await b(this.createAuthCodeClient.bind(this),g.StandardInteractionClientCreateAuthCodeClient,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:r,requestAuthority:i,account:e.account||void 0});try{d.authority.endSessionEndpoint}catch{if((s=e.account)!=null&&s.homeAccountId&&e.postLogoutRedirectUri&&d.authority.protocolMode===ve.OIDC){if(this.browserStorage.removeAccount((n=e.account)==null?void 0:n.homeAccountId,this.correlationId),this.eventHandler.emitEvent(k.LOGOUT_SUCCESS,I.Popup,e),a){const h={apiId:$.logoutPopup,timeout:this.config.system.redirectNavigationTimeout,noHistory:!1},m=x.getAbsoluteUrl(a,fe());await this.navigationClient.navigateInternal(m,h)}(c=t.popup)==null||c.close();return}}const u=d.getLogoutUri(e);this.eventHandler.emitEvent(k.LOGOUT_SUCCESS,I.Popup,e);const p=this.openPopup(u,t);if(this.eventHandler.emitEvent(k.POPUP_OPENED,I.Popup,{popupWindow:p},null),await this.monitorPopupForHash(p,t.popupWindowParent).catch(()=>{}),a){const h={apiId:$.logoutPopup,timeout:this.config.system.redirectNavigationTimeout,noHistory:!1},m=x.getAbsoluteUrl(a,fe());this.logger.verbose("Redirecting main window to url specified in the request"),this.logger.verbosePii(`Redirecting main window to: ${m}`),await this.navigationClient.navigateInternal(m,h)}else this.logger.verbose("No main window navigation requested")}catch(d){throw(l=t.popup)==null||l.close(),d instanceof D&&(d.setCorrelationId(this.correlationId),r.cacheFailedRequest(d)),this.browserStorage.setInteractionInProgress(!1),this.eventHandler.emitEvent(k.LOGOUT_FAILURE,I.Popup,null,d),this.eventHandler.emitEvent(k.LOGOUT_END,I.Popup),d}this.eventHandler.emitEvent(k.LOGOUT_END,I.Popup)}initiateAuthRequest(e,t){if(e)return this.logger.infoPii(`Navigate to: ${e}`),this.openPopup(e,t);throw this.logger.error("Navigate url is empty"),A(Mt)}monitorPopupForHash(e,t){return new Promise((i,a)=>{this.logger.verbose("PopupHandler.monitorPopupForHash - polling started");const r=setInterval(()=>{if(e.closed){this.logger.error("PopupHandler.monitorPopupForHash - window closed"),clearInterval(r),a(A(ke));return}let s="";try{s=e.location.href}catch{}if(!s||s==="about:blank")return;clearInterval(r);let n="";const c=this.config.auth.OIDCOptions.serverResponseType;e&&(c===tt.QUERY?n=e.location.search:n=e.location.hash),this.logger.verbose("PopupHandler.monitorPopupForHash - popup window is on same origin as caller"),i(n)},this.config.system.pollIntervalMilliseconds)}).finally(()=>{this.cleanPopup(e,t)})}openPopup(e,t){try{let i;if(t.popup?(i=t.popup,this.logger.verbosePii(`Navigating popup window to: ${e}`),i.location.assign(e)):typeof t.popup>"u"&&(this.logger.verbosePii(`Opening popup window to: ${e}`),i=this.openSizedPopup(e,t)),!i)throw A(qr);return i.focus&&i.focus(),this.currentWindow=i,t.popupWindowParent.addEventListener("beforeunload",this.unloadWindow),i}catch(i){throw this.logger.error("error opening popup "+i.message),this.browserStorage.setInteractionInProgress(!1),A(zr)}}openSizedPopup(e,{popupName:t,popupWindowAttributes:i,popupWindowParent:a}){var h,m,v,w;const r=a.screenLeft?a.screenLeft:a.screenX,s=a.screenTop?a.screenTop:a.screenY,n=a.innerWidth||document.documentElement.clientWidth||document.body.clientWidth,c=a.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;let l=(h=i.popupSize)==null?void 0:h.width,d=(m=i.popupSize)==null?void 0:m.height,u=(v=i.popupPosition)==null?void 0:v.top,p=(w=i.popupPosition)==null?void 0:w.left;return(!l||l<0||l>n)&&(this.logger.verbose("Default popup window width used. Window width not configured or invalid."),l=Q.POPUP_WIDTH),(!d||d<0||d>c)&&(this.logger.verbose("Default popup window height used. Window height not configured or invalid."),d=Q.POPUP_HEIGHT),(!u||u<0||u>c)&&(this.logger.verbose("Default popup window top position used. Window top not configured or invalid."),u=Math.max(0,c/2-Q.POPUP_HEIGHT/2+s)),(!p||p<0||p>n)&&(this.logger.verbose("Default popup window left position used. Window left not configured or invalid."),p=Math.max(0,n/2-Q.POPUP_WIDTH/2+r)),a.open(e,t,`width=${l}, height=${d}, top=${u}, left=${p}, scrollbars=yes`)}unloadWindow(e){this.browserStorage.cleanRequestByInteractionType(I.Popup),this.currentWindow&&this.currentWindow.close(),e.preventDefault()}cleanPopup(e,t){e.close(),t.removeEventListener("beforeunload",this.unloadWindow),this.browserStorage.setInteractionInProgress(!1)}generatePopupName(e,t){return`${Q.POPUP_NAME_PREFIX}.${this.config.auth.clientId}.${e.join("-")}.${t}.${this.correlationId}`}generateLogoutPopupName(e){const t=e.account&&e.account.homeAccountId;return`${Q.POPUP_NAME_PREFIX}.${this.config.auth.clientId}.${t}.${this.correlationId}`}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Ma{constructor(e,t,i,a,r){this.authModule=e,this.browserStorage=t,this.authCodeRequest=i,this.logger=a,this.performanceClient=r}async initiateAuthRequest(e,t){if(this.logger.verbose("RedirectHandler.initiateAuthRequest called"),e){t.redirectStartPage&&(this.logger.verbose("RedirectHandler.initiateAuthRequest: redirectStartPage set, caching start page"),this.browserStorage.setTemporaryCache(_.ORIGIN_URI,t.redirectStartPage,!0)),this.browserStorage.setTemporaryCache(_.CORRELATION_ID,this.authCodeRequest.correlationId,!0),this.browserStorage.cacheCodeRequest(this.authCodeRequest),this.logger.infoPii(`RedirectHandler.initiateAuthRequest: Navigate to: ${e}`);const i={apiId:$.acquireTokenRedirect,timeout:t.redirectTimeout,noHistory:!1};if(typeof t.onRedirectNavigate=="function")if(this.logger.verbose("RedirectHandler.initiateAuthRequest: Invoking onRedirectNavigate callback"),t.onRedirectNavigate(e)!==!1){this.logger.verbose("RedirectHandler.initiateAuthRequest: onRedirectNavigate did not return false, navigating"),await t.navigationClient.navigateExternal(e,i);return}else{this.logger.verbose("RedirectHandler.initiateAuthRequest: onRedirectNavigate returned false, stopping navigation");return}else{this.logger.verbose("RedirectHandler.initiateAuthRequest: Navigating window to navigate url"),await t.navigationClient.navigateExternal(e,i);return}}else throw this.logger.info("RedirectHandler.initiateAuthRequest: Navigate url is empty"),A(Mt)}async handleCodeResponse(e,t){this.logger.verbose("RedirectHandler.handleCodeResponse called"),this.browserStorage.setInteractionInProgress(!1);const i=this.browserStorage.generateStateKey(t),a=this.browserStorage.getTemporaryCache(i);if(!a)throw y(mt,"Cached State");let r;try{r=this.authModule.handleFragmentResponse(e,a)}catch(l){throw l instanceof we&&l.subError===ke?A(ke):l}const s=this.browserStorage.generateNonceKey(a),n=this.browserStorage.getTemporaryCache(s);if(this.authCodeRequest.code=r.code,r.cloud_instance_host_name&&await b(this.authModule.updateAuthority.bind(this.authModule),g.UpdateTokenEndpointAuthority,this.logger,this.performanceClient,this.authCodeRequest.correlationId)(r.cloud_instance_host_name,this.authCodeRequest.correlationId),r.nonce=n||void 0,r.state=a,r.client_info)this.authCodeRequest.clientInfo=r.client_info;else{const l=this.checkCcsCredentials();l&&(this.authCodeRequest.ccsCredential=l)}const c=await this.authModule.acquireToken(this.authCodeRequest,r);return this.browserStorage.cleanRequestByState(t),c}checkCcsCredentials(){const e=this.browserStorage.getTemporaryCache(_.CCS_CREDENTIAL,!0);if(e)try{return JSON.parse(e)}catch{this.authModule.logger.error("Cache credential could not be parsed"),this.authModule.logger.errorPii(`Cache credential could not be parsed: ${e}`)}return null}}/*! @azure/msal-browser v3.30.0 2025-08-05 */function Kc(){if(typeof window>"u"||typeof window.performance>"u"||typeof window.performance.getEntriesByType!="function")return;const o=window.performance.getEntriesByType("navigation"),e=o.length?o[0]:void 0;return e==null?void 0:e.type}class jc extends Ke{constructor(e,t,i,a,r,s,n,c,l,d){super(e,t,i,a,r,s,n,l,d),this.nativeStorage=c}async acquireToken(e){const t=await b(this.initializeAuthorizationRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationRequest,this.logger,this.performanceClient,this.correlationId)(e,I.Redirect);this.browserStorage.updateCacheEntries(t.state,t.nonce,t.authority,t.loginHint||"",t.account||null);const i=this.initializeServerTelemetryManager($.acquireTokenRedirect),a=r=>{r.persisted&&(this.logger.verbose("Page was restored from back/forward cache. Clearing temporary cache."),this.browserStorage.cleanRequestByState(t.state),this.eventHandler.emitEvent(k.RESTORE_FROM_BFCACHE,I.Redirect))};try{const r=await b(this.initializeAuthorizationCodeRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationCodeRequest,this.logger,this.performanceClient,this.correlationId)(t),s=await b(this.createAuthCodeClient.bind(this),g.StandardInteractionClientCreateAuthCodeClient,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:i,requestAuthority:t.authority,requestAzureCloudOptions:t.azureCloudOptions,requestExtraQueryParameters:t.extraQueryParameters,account:t.account}),n=new Ma(s,this.browserStorage,r,this.logger,this.performanceClient),c=await s.getAuthCodeUrl({...t,nativeBroker:ce.isNativeAvailable(this.config,this.logger,this.nativeMessageHandler,e.authenticationScheme)}),l=this.getRedirectStartPage(e.redirectStartPage);return this.logger.verbosePii(`Redirect start page: ${l}`),window.addEventListener("pageshow",a),await n.initiateAuthRequest(c,{navigationClient:this.navigationClient,redirectTimeout:this.config.system.redirectNavigationTimeout,redirectStartPage:l,onRedirectNavigate:e.onRedirectNavigate||this.config.auth.onRedirectNavigate})}catch(r){throw r instanceof D&&(r.setCorrelationId(this.correlationId),i.cacheFailedRequest(r)),window.removeEventListener("pageshow",a),this.browserStorage.cleanRequestByState(t.state),r}}async handleRedirectPromise(e="",t){const i=this.initializeServerTelemetryManager($.handleRedirectPromise);try{if(!this.browserStorage.isInteractionInProgress(!0))return this.logger.info("handleRedirectPromise called but there is no interaction in progress, returning null."),null;const[a,r]=this.getRedirectResponse(e||"");if(!a)return this.logger.info("handleRedirectPromise did not detect a response as a result of a redirect. Cleaning temporary cache."),this.browserStorage.cleanRequestByInteractionType(I.Redirect),Kc()!=="back_forward"?t.event.errorCode="no_server_response":this.logger.verbose("Back navigation event detected. Muting no_server_response error"),null;const s=this.browserStorage.getTemporaryCache(_.ORIGIN_URI,!0)||f.EMPTY_STRING,n=x.removeHashFromUrl(s),c=x.removeHashFromUrl(window.location.href);if(n===c&&this.config.auth.navigateToLoginRequestUrl)return this.logger.verbose("Current page is loginRequestUrl, handling response"),s.indexOf("#")>-1&&Zo(s),await this.handleResponse(a,i);if(this.config.auth.navigateToLoginRequestUrl){if(!Ki()||this.config.system.allowRedirectInIframe){this.browserStorage.setTemporaryCache(_.URL_HASH,r,!0);const l={apiId:$.handleRedirectPromise,timeout:this.config.system.redirectNavigationTimeout,noHistory:!0};let d=!0;if(!s||s==="null"){const u=tc();this.browserStorage.setTemporaryCache(_.ORIGIN_URI,u,!0),this.logger.warning("Unable to get valid login request url from cache, redirecting to home page"),d=await this.navigationClient.navigateInternal(u,l)}else this.logger.verbose(`Navigating to loginRequestUrl: ${s}`),d=await this.navigationClient.navigateInternal(s,l);if(!d)return await this.handleResponse(a,i)}}else return this.logger.verbose("NavigateToLoginRequestUrl set to false, handling response"),await this.handleResponse(a,i);return null}catch(a){throw a instanceof D&&(a.setCorrelationId(this.correlationId),i.cacheFailedRequest(a)),this.browserStorage.cleanRequestByInteractionType(I.Redirect),a}}getRedirectResponse(e){this.logger.verbose("getRedirectResponseHash called");let t=e;t||(this.config.auth.OIDCOptions.serverResponseType===tt.QUERY?t=window.location.search:t=window.location.hash);let i=bt(t);if(i){try{Bc(i,this.browserCrypto,I.Redirect)}catch(r){return r instanceof D&&this.logger.error(`Interaction type validation failed due to ${r.errorCode}: ${r.errorMessage}`),[null,""]}return Xo(window),this.logger.verbose("Hash contains known properties, returning response hash"),[i,t]}const a=this.browserStorage.getTemporaryCache(_.URL_HASH,!0);return this.browserStorage.removeItem(this.browserStorage.generateCacheKey(_.URL_HASH)),a&&(i=bt(a),i)?(this.logger.verbose("Hash does not contain known properties, returning cached hash"),[i,a]):[null,""]}async handleResponse(e,t){const i=e.state;if(!i)throw A(Di);const a=this.browserStorage.getCachedRequest(i);if(this.logger.verbose("handleResponse called, retrieved cached request"),e.accountId){if(this.logger.verbose("Account id found in hash, calling WAM for token"),!this.nativeMessageHandler)throw A(it);const c=new Ue(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,$.acquireTokenPopup,this.performanceClient,this.nativeMessageHandler,e.accountId,this.nativeStorage,a.correlationId),{userRequestState:l}=ae.parseRequestState(this.browserCrypto,i);return c.acquireToken({...a,state:l,prompt:void 0}).finally(()=>{this.browserStorage.cleanRequestByState(i)})}const r=this.browserStorage.getCachedAuthority(i);if(!r)throw A(Li);const s=await b(this.createAuthCodeClient.bind(this),g.StandardInteractionClientCreateAuthCodeClient,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:t,requestAuthority:r});return ne.removeThrottle(this.browserStorage,this.config.auth.clientId,a),new Ma(s,this.browserStorage,a,this.logger,this.performanceClient).handleCodeResponse(e,i)}async logout(e){var a,r;this.logger.verbose("logoutRedirect called");const t=this.initializeLogoutRequest(e),i=this.initializeServerTelemetryManager($.logout);try{this.eventHandler.emitEvent(k.LOGOUT_START,I.Redirect,e),await this.clearCacheOnLogout(t.account);const s={apiId:$.logout,timeout:this.config.system.redirectNavigationTimeout,noHistory:!1},n=await b(this.createAuthCodeClient.bind(this),g.StandardInteractionClientCreateAuthCodeClient,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:i,requestAuthority:e&&e.authority,requestExtraQueryParameters:e==null?void 0:e.extraQueryParameters,account:e&&e.account||void 0});if(n.authority.protocolMode===ve.OIDC)try{n.authority.endSessionEndpoint}catch{if((a=t.account)!=null&&a.homeAccountId){this.browserStorage.removeAccount((r=t.account)==null?void 0:r.homeAccountId,this.correlationId),this.eventHandler.emitEvent(k.LOGOUT_SUCCESS,I.Redirect,t);return}}const c=n.getLogoutUri(t);if(this.eventHandler.emitEvent(k.LOGOUT_SUCCESS,I.Redirect,t),e&&typeof e.onRedirectNavigate=="function")if(e.onRedirectNavigate(c)!==!1){this.logger.verbose("Logout onRedirectNavigate did not return false, navigating"),this.browserStorage.getInteractionInProgress()||this.browserStorage.setInteractionInProgress(!0),await this.navigationClient.navigateExternal(c,s);return}else this.browserStorage.setInteractionInProgress(!1),this.logger.verbose("Logout onRedirectNavigate returned false, stopping navigation");else{this.browserStorage.getInteractionInProgress()||this.browserStorage.setInteractionInProgress(!0),await this.navigationClient.navigateExternal(c,s);return}}catch(s){throw s instanceof D&&(s.setCorrelationId(this.correlationId),i.cacheFailedRequest(s)),this.eventHandler.emitEvent(k.LOGOUT_FAILURE,I.Redirect,null,s),this.eventHandler.emitEvent(k.LOGOUT_END,I.Redirect),s}this.eventHandler.emitEvent(k.LOGOUT_END,I.Redirect)}getRedirectStartPage(e){const t=e||window.location.href;return x.getAbsoluteUrl(t,fe())}}/*! @azure/msal-browser v3.30.0 2025-08-05 */async function Vc(o,e,t,i,a){if(e.addQueueMeasurement(g.SilentHandlerInitiateAuthRequest,i),!o)throw t.info("Navigate url is empty"),A(Mt);return a?b(Wc,g.SilentHandlerLoadFrame,t,e,i)(o,a,e,i):Re(Jc,g.SilentHandlerLoadFrameSync,t,e,i)(o)}async function Yc(o,e,t,i,a,r,s){return i.addQueueMeasurement(g.SilentHandlerMonitorIframeForHash,r),new Promise((n,c)=>{e<ri&&a.warning(`system.loadFrameTimeout or system.iframeHashTimeout set to lower (${e}ms) than the default (${ri}ms). This may result in timeouts.`);const l=window.setTimeout(()=>{window.clearInterval(d),c(A(Fr))},e),d=window.setInterval(()=>{let u="";const p=o.contentWindow;try{u=p?p.location.href:""}catch{}if(!u||u==="about:blank")return;let h="";p&&(s===tt.QUERY?h=p.location.search:h=p.location.hash),window.clearTimeout(l),window.clearInterval(d),n(h)},t)}).finally(()=>{Re(Qc,g.RemoveHiddenIframe,a,i,r)(o)})}function Wc(o,e,t,i){return t.addQueueMeasurement(g.SilentHandlerLoadFrame,i),new Promise((a,r)=>{const s=Is();window.setTimeout(()=>{if(!s){r("Unable to load iframe");return}s.src=o,a(s)},e)})}function Jc(o){const e=Is();return e.src=o,e}function Is(){const o=document.createElement("iframe");return o.className="msalSilentIframe",o.style.visibility="hidden",o.style.position="absolute",o.style.width=o.style.height="0",o.style.border="0",o.setAttribute("sandbox","allow-scripts allow-same-origin allow-forms"),document.body.appendChild(o),o}function Qc(o){document.body===o.parentNode&&document.body.removeChild(o)}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Xc extends Ke{constructor(e,t,i,a,r,s,n,c,l,d,u){super(e,t,i,a,r,s,c,d,u),this.apiId=n,this.nativeStorage=l}async acquireToken(e){this.performanceClient.addQueueMeasurement(g.SilentIframeClientAcquireToken,e.correlationId),!e.loginHint&&!e.sid&&(!e.account||!e.account.username)&&this.logger.warning("No user hint provided. The authorization server may need more information to complete this request.");const t={...e};t.prompt?t.prompt!==F.NONE&&t.prompt!==F.NO_SESSION&&(this.logger.warning(`SilentIframeClient. Replacing invalid prompt ${t.prompt} with ${F.NONE}`),t.prompt=F.NONE):t.prompt=F.NONE;const i=await b(this.initializeAuthorizationRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationRequest,this.logger,this.performanceClient,e.correlationId)(t,I.Silent);ys(i.authority);const a=this.initializeServerTelemetryManager(this.apiId);let r;try{return r=await b(this.createAuthCodeClient.bind(this),g.StandardInteractionClientCreateAuthCodeClient,this.logger,this.performanceClient,e.correlationId)({serverTelemetryManager:a,requestAuthority:i.authority,requestAzureCloudOptions:i.azureCloudOptions,requestExtraQueryParameters:i.extraQueryParameters,account:i.account}),await b(this.silentTokenHelper.bind(this),g.SilentIframeClientTokenHelper,this.logger,this.performanceClient,e.correlationId)(r,i)}catch(s){if(s instanceof D&&(s.setCorrelationId(this.correlationId),a.cacheFailedRequest(s)),!r||!(s instanceof D)||s.errorCode!==Q.INVALID_GRANT_ERROR)throw s;this.performanceClient.addFields({retryError:s.errorCode},this.correlationId);const n=await b(this.initializeAuthorizationRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationRequest,this.logger,this.performanceClient,e.correlationId)(t,I.Silent);return await b(this.silentTokenHelper.bind(this),g.SilentIframeClientTokenHelper,this.logger,this.performanceClient,this.correlationId)(r,n)}}logout(){return Promise.reject(A(Nt))}async silentTokenHelper(e,t){const i=t.correlationId;this.performanceClient.addQueueMeasurement(g.SilentIframeClientTokenHelper,i);const a=await b(this.initializeAuthorizationCodeRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationCodeRequest,this.logger,this.performanceClient,i)(t),r=await b(e.getAuthCodeUrl.bind(e),g.GetAuthCodeUrl,this.logger,this.performanceClient,i)({...t,nativeBroker:ce.isNativeAvailable(this.config,this.logger,this.nativeMessageHandler,t.authenticationScheme)}),s=new Wi(e,this.browserStorage,a,this.logger,this.performanceClient),n=await b(Vc,g.SilentHandlerInitiateAuthRequest,this.logger,this.performanceClient,i)(r,this.performanceClient,this.logger,i,this.config.system.navigateFrameWait),c=this.config.auth.OIDCOptions.serverResponseType,l=await b(Yc,g.SilentHandlerMonitorIframeForHash,this.logger,this.performanceClient,i)(n,this.config.system.iframeHashTimeout,this.config.system.pollIntervalMilliseconds,this.performanceClient,this.logger,i,c),d=Re(Ts,g.DeserializeResponse,this.logger,this.performanceClient,this.correlationId)(l,c,this.logger);if(d.accountId){if(this.logger.verbose("Account id found in hash, calling WAM for token"),!this.nativeMessageHandler)throw A(it);const u=new Ue(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,this.apiId,this.performanceClient,this.nativeMessageHandler,d.accountId,this.browserStorage,i),{userRequestState:p}=ae.parseRequestState(this.browserCrypto,t.state);return b(u.acquireToken.bind(u),g.NativeInteractionClientAcquireToken,this.logger,this.performanceClient,i)({...t,state:p,prompt:t.prompt||F.NONE})}return b(s.handleCodeResponse.bind(s),g.HandleCodeResponse,this.logger,this.performanceClient,i)(d,t)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Zc extends Ke{async acquireToken(e){this.performanceClient.addQueueMeasurement(g.SilentRefreshClientAcquireToken,e.correlationId);const t=await b(Yi,g.InitializeBaseRequest,this.logger,this.performanceClient,e.correlationId)(e,this.config,this.performanceClient,this.logger),i={...e,...t};e.redirectUri&&(i.redirectUri=this.getRedirectUri(e.redirectUri));const a=this.initializeServerTelemetryManager($.acquireTokenSilent_silentFlow),r=await this.createRefreshTokenClient({serverTelemetryManager:a,authorityUrl:i.authority,azureCloudOptions:i.azureCloudOptions,account:i.account});return b(r.acquireTokenByRefreshToken.bind(r),g.RefreshTokenClientAcquireTokenByRefreshToken,this.logger,this.performanceClient,e.correlationId)(i).catch(s=>{throw s.setCorrelationId(this.correlationId),a.cacheFailedRequest(s),s})}logout(){return Promise.reject(A(Nt))}async createRefreshTokenClient(e){const t=await b(this.getClientConfiguration.bind(this),g.StandardInteractionClientGetClientConfiguration,this.logger,this.performanceClient,this.correlationId)({serverTelemetryManager:e.serverTelemetryManager,requestAuthority:e.authorityUrl,requestAzureCloudOptions:e.azureCloudOptions,requestExtraQueryParameters:e.extraQueryParameters,account:e.account});return new ei(t,this.performanceClient)}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class el{constructor(e,t,i,a){this.isBrowserEnvironment=typeof window<"u",this.config=e,this.storage=t,this.logger=i,this.cryptoObj=a}loadExternalTokens(e,t,i){if(!this.isBrowserEnvironment)throw A(Ot);const a=e.correlationId||ue(),r=t.id_token?Se(t.id_token,le):void 0,s={protocolMode:this.config.auth.protocolMode,knownAuthorities:this.config.auth.knownAuthorities,cloudDiscoveryMetadata:this.config.auth.cloudDiscoveryMetadata,authorityMetadata:this.config.auth.authorityMetadata,skipAuthorityMetadataCache:this.config.auth.skipAuthorityMetadataCache},n=e.authority?new G(G.generateAuthority(e.authority,e.azureCloudOptions),this.config.system.networkClient,this.storage,s,this.logger,e.correlationId||ue()):void 0,c=this.loadAccount(e,i.clientInfo||t.client_info||"",a,r,n),l=this.loadIdToken(t,c.homeAccountId,c.environment,c.realm,a),d=this.loadAccessToken(e,t,c.homeAccountId,c.environment,c.realm,i,a),u=this.loadRefreshToken(t,c.homeAccountId,c.environment,a);return this.generateAuthenticationResult(e,{account:c,idToken:l,accessToken:d,refreshToken:u},r,n)}loadAccount(e,t,i,a,r){if(this.logger.verbose("TokenCache - loading account"),e.account){const l=z.createFromAccountInfo(e.account);return this.storage.setAccount(l,i),l}else if(!r||!t&&!a)throw this.logger.error("TokenCache - if an account is not provided on the request, authority and either clientInfo or idToken must be provided instead."),A(Qr);const s=z.generateHomeAccountId(t,r.authorityType,this.logger,this.cryptoObj,a),n=a==null?void 0:a.tid,c=Mi(this.storage,r,s,le,i,a,t,r.hostnameAndPort,n,void 0,void 0,this.logger);return this.storage.setAccount(c,i),c}loadIdToken(e,t,i,a,r){if(!e.id_token)return this.logger.verbose("TokenCache - no id token found in response"),null;this.logger.verbose("TokenCache - loading id token");const s=Et(t,i,e.id_token,this.config.auth.clientId,a);return this.storage.setIdTokenCredential(s,r),s}loadAccessToken(e,t,i,a,r,s,n){if(t.access_token)if(t.expires_in){if(!t.scope&&(!e.scopes||!e.scopes.length))return this.logger.error("TokenCache - scopes not specified in the request or response. Cannot add token to the cache."),null}else return this.logger.error("TokenCache - no expiration set on the access token. Cannot add it to the cache."),null;else return this.logger.verbose("TokenCache - no access token found in response"),null;this.logger.verbose("TokenCache - loading access token");const c=t.scope?U.fromString(t.scope):new U(e.scopes),l=s.expiresOn||t.expires_in+new Date().getTime()/1e3,d=s.extendedExpiresOn||(t.ext_expires_in||t.expires_in)+new Date().getTime()/1e3,u=St(i,a,t.access_token,this.config.auth.clientId,r,c.printScopes(),l,d,le);return this.storage.setAccessTokenCredential(u,n),u}loadRefreshToken(e,t,i,a){if(!e.refresh_token)return this.logger.verbose("TokenCache - no refresh token found in response"),null;this.logger.verbose("TokenCache - loading refresh token");const r=rr(t,i,e.refresh_token,this.config.auth.clientId,e.foci,void 0,e.refresh_token_expires_in);return this.storage.setRefreshTokenCredential(r,a),r}generateAuthenticationResult(e,t,i,a){var d,u,p;let r="",s=[],n=null,c;t!=null&&t.accessToken&&(r=t.accessToken.secret,s=U.fromString(t.accessToken.target).asArray(),n=new Date(Number(t.accessToken.expiresOn)*1e3),c=new Date(Number(t.accessToken.extendedExpiresOn)*1e3));const l=t.account;return{authority:a?a.canonicalAuthority:"",uniqueId:t.account.localAccountId,tenantId:t.account.realm,scopes:s,account:l.getAccountInfo(),idToken:((d=t.idToken)==null?void 0:d.secret)||"",idTokenClaims:i||{},accessToken:r,fromCache:!0,expiresOn:n,correlationId:e.correlationId||"",requestId:"",extExpiresOn:c,familyId:((u=t.refreshToken)==null?void 0:u.familyId)||"",tokenType:((p=t==null?void 0:t.accessToken)==null?void 0:p.tokenType)||"",state:e.state||"",cloudGraphHostName:l.cloudGraphHostName||"",msGraphHost:l.msGraphHost||"",fromNativeBroker:!1}}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class tl extends _r{constructor(e){super(e),this.includeRedirectUri=!1}}/*! @azure/msal-browser v3.30.0 2025-08-05 */class il extends Ke{constructor(e,t,i,a,r,s,n,c,l,d){super(e,t,i,a,r,s,c,l,d),this.apiId=n}async acquireToken(e){if(!e.code)throw A(Xr);const t=await b(this.initializeAuthorizationRequest.bind(this),g.StandardInteractionClientInitializeAuthorizationRequest,this.logger,this.performanceClient,e.correlationId)(e,I.Silent),i=this.initializeServerTelemetryManager(this.apiId);try{const a={...t,code:e.code},r=await b(this.getClientConfiguration.bind(this),g.StandardInteractionClientGetClientConfiguration,this.logger,this.performanceClient,e.correlationId)({serverTelemetryManager:i,requestAuthority:t.authority,requestAzureCloudOptions:t.azureCloudOptions,requestExtraQueryParameters:t.extraQueryParameters,account:t.account}),s=new tl(r);this.logger.verbose("Auth code client created");const n=new Wi(s,this.browserStorage,a,this.logger,this.performanceClient);return await b(n.handleCodeResponseFromServer.bind(n),g.HandleCodeResponseFromServer,this.logger,this.performanceClient,e.correlationId)({code:e.code,msgraph_host:e.msGraphHost,cloud_graph_host_name:e.cloudGraphHostName,cloud_instance_host_name:e.cloudInstanceHostName},t,!1)}catch(a){throw a instanceof D&&(a.setCorrelationId(this.correlationId),i.cacheFailedRequest(a)),a}}logout(){return Promise.reject(A(Nt))}}/*! @azure/msal-browser v3.30.0 2025-08-05 */function re(o){const e=o==null?void 0:o.idTokenClaims;if(e!=null&&e.tfp||e!=null&&e.acr)return"B2C";if(e!=null&&e.tid){if((e==null?void 0:e.tid)==="9188040d-6c67-4c5b-b112-36a304b66dad")return"MSA"}else return;return"AAD"}function ut(o,e){try{ji(o)}catch(t){throw e.end({success:!1},t),t}}class Dt{constructor(e){this.operatingContext=e,this.isBrowserEnvironment=this.operatingContext.isBrowserEnvironment(),this.config=e.getConfig(),this.initialized=!1,this.logger=this.operatingContext.getLogger(),this.networkClient=this.config.system.networkClient,this.navigationClient=this.config.system.navigationClient,this.redirectResponse=new Map,this.hybridAuthCodeResponses=new Map,this.performanceClient=this.config.telemetry.client,this.browserCrypto=this.isBrowserEnvironment?new Be(this.logger,this.performanceClient):ft,this.eventHandler=new Rc(this.logger),this.browserStorage=this.isBrowserEnvironment?new ni(this.config.auth.clientId,this.config.cache,this.browserCrypto,this.logger,go(this.config.auth),this.performanceClient):Cc(this.config.auth.clientId,this.logger);const t={cacheLocation:Y.MemoryStorage,temporaryCacheLocation:Y.MemoryStorage,storeAuthStateInCookie:!1,secureCookies:!1,cacheMigrationEnabled:!1,claimsBasedCachingEnabled:!1};this.nativeInternalStorage=new ni(this.config.auth.clientId,t,this.browserCrypto,this.logger,void 0,this.performanceClient),this.tokenCache=new el(this.config,this.browserStorage,this.logger,this.browserCrypto),this.activeSilentTokenRequests=new Map,this.trackPageVisibility=this.trackPageVisibility.bind(this),this.trackPageVisibilityWithMeasurement=this.trackPageVisibilityWithMeasurement.bind(this),this.listeningToStorageEvents=!1,this.handleAccountCacheChange=this.handleAccountCacheChange.bind(this)}static async createController(e,t){const i=new Dt(e);return await i.initialize(t),i}trackPageVisibility(e){e&&(this.logger.info("Perf: Visibility change detected"),this.performanceClient.incrementFields({visibilityChangeCount:1},e))}async initialize(e){if(this.logger.trace("initialize called"),this.initialized){this.logger.info("initialize has already been called, exiting early.");return}if(!this.isBrowserEnvironment){this.logger.info("in non-browser environment, exiting early."),this.initialized=!0,this.eventHandler.emitEvent(k.INITIALIZE_END);return}const t=(e==null?void 0:e.correlationId)||this.getRequestCorrelationId(),i=this.config.system.allowNativeBroker,a=this.performanceClient.startMeasurement(g.InitializeClientApplication,t);if(this.eventHandler.emitEvent(k.INITIALIZE_START),i)try{this.nativeExtensionProvider=await ce.createProvider(this.logger,this.config.system.nativeBrokerHandshakeTimeout,this.performanceClient)}catch(r){this.logger.verbose(r)}this.config.cache.claimsBasedCachingEnabled||(this.logger.verbose("Claims-based caching is disabled. Clearing the previous cache with claims"),await b(this.browserStorage.clearTokensAndKeysWithClaims.bind(this.browserStorage),g.ClearTokensAndKeysWithClaims,this.logger,this.performanceClient,t)(this.performanceClient,t)),this.initialized=!0,this.eventHandler.emitEvent(k.INITIALIZE_END),a.end({allowNativeBroker:i,success:!0})}async handleRedirectPromise(e){if(this.logger.verbose("handleRedirectPromise called"),vs(this.initialized),this.isBrowserEnvironment){const t=e||"";let i=this.redirectResponse.get(t);return typeof i>"u"?(i=this.handleRedirectPromiseInternal(e),this.redirectResponse.set(t,i),this.logger.verbose("handleRedirectPromise has been called for the first time, storing the promise")):this.logger.verbose("handleRedirectPromise has been called previously, returning the result from the first call"),i}return this.logger.verbose("handleRedirectPromise returns null, not browser environment"),null}async handleRedirectPromiseInternal(e){const t=this.getAllAccounts(),i=this.browserStorage.getCachedNativeRequest(),a=i&&ce.isNativeAvailable(this.config,this.logger,this.nativeExtensionProvider)&&this.nativeExtensionProvider&&!e,r=a?i==null?void 0:i.correlationId:this.browserStorage.getTemporaryCache(_.CORRELATION_ID,!0)||"",s=this.performanceClient.startMeasurement(g.AcquireTokenRedirect,r);this.eventHandler.emitEvent(k.HANDLE_REDIRECT_START,I.Redirect);let n;if(a&&this.nativeExtensionProvider){this.logger.trace("handleRedirectPromise - acquiring token from native platform");const c=new Ue(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,$.handleRedirectPromise,this.performanceClient,this.nativeExtensionProvider,i.accountId,this.nativeInternalStorage,i.correlationId);n=b(c.handleRedirectPromise.bind(c),g.HandleNativeRedirectPromiseMeasurement,this.logger,this.performanceClient,s.event.correlationId)(this.performanceClient,s.event.correlationId)}else{this.logger.trace("handleRedirectPromise - acquiring token from web flow");const c=this.createRedirectClient(r);n=b(c.handleRedirectPromise.bind(c),g.HandleRedirectPromiseMeasurement,this.logger,this.performanceClient,s.event.correlationId)(e,s)}return n.then(c=>(c?(t.length<this.getAllAccounts().length?(this.eventHandler.emitEvent(k.LOGIN_SUCCESS,I.Redirect,c),this.logger.verbose("handleRedirectResponse returned result, login success")):(this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_SUCCESS,I.Redirect,c),this.logger.verbose("handleRedirectResponse returned result, acquire token success")),s.end({success:!0,accountType:re(c.account)})):s.event.errorCode?s.end({success:!1}):s.discard(),this.eventHandler.emitEvent(k.HANDLE_REDIRECT_END,I.Redirect),c)).catch(c=>{const l=c;throw t.length>0?this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_FAILURE,I.Redirect,null,l):this.eventHandler.emitEvent(k.LOGIN_FAILURE,I.Redirect,null,l),this.eventHandler.emitEvent(k.HANDLE_REDIRECT_END,I.Redirect),s.end({success:!1},l),c})}async acquireTokenRedirect(e){const t=this.getRequestCorrelationId(e);this.logger.verbose("acquireTokenRedirect called",t);const i=this.performanceClient.startMeasurement(g.AcquireTokenPreRedirect,t);i.add({accountType:re(e.account),scenarioId:e.scenarioId});const a=e.onRedirectNavigate;if(a)e.onRedirectNavigate=s=>{const n=typeof a=="function"?a(s):void 0;return n!==!1?i.end({success:!0}):i.discard(),n};else{const s=this.config.auth.onRedirectNavigate;this.config.auth.onRedirectNavigate=n=>{const c=typeof s=="function"?s(n):void 0;return c!==!1?i.end({success:!0}):i.discard(),c}}const r=this.getAllAccounts().length>0;try{Ra(this.initialized,this.config),this.browserStorage.setInteractionInProgress(!0),r?this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_START,I.Redirect,e):this.eventHandler.emitEvent(k.LOGIN_START,I.Redirect,e);let s;return this.nativeExtensionProvider&&this.canUseNative(e)?s=new Ue(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,$.acquireTokenRedirect,this.performanceClient,this.nativeExtensionProvider,this.getNativeAccountId(e),this.nativeInternalStorage,t).acquireTokenRedirect(e,i).catch(c=>{if(c instanceof oe&&Ne(c))return this.nativeExtensionProvider=void 0,this.createRedirectClient(t).acquireToken(e);if(c instanceof ee)return this.logger.verbose("acquireTokenRedirect - Resolving interaction required error thrown by native broker by falling back to web flow"),this.createRedirectClient(t).acquireToken(e);throw this.browserStorage.setInteractionInProgress(!1),c}):s=this.createRedirectClient(t).acquireToken(e),await s}catch(s){throw i.end({success:!1},s),r?this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_FAILURE,I.Redirect,null,s):this.eventHandler.emitEvent(k.LOGIN_FAILURE,I.Redirect,null,s),s}}acquireTokenPopup(e){const t=this.getRequestCorrelationId(e),i=this.performanceClient.startMeasurement(g.AcquireTokenPopup,t);i.add({scenarioId:e.scenarioId,accountType:re(e.account)});try{this.logger.verbose("acquireTokenPopup called",t),ut(this.initialized,i),this.browserStorage.setInteractionInProgress(!0)}catch(s){return Promise.reject(s)}const a=this.getAllAccounts();a.length>0?this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_START,I.Popup,e):this.eventHandler.emitEvent(k.LOGIN_START,I.Popup,e);let r;return this.canUseNative(e)?r=this.acquireTokenNative({...e,correlationId:t},$.acquireTokenPopup).then(s=>(this.browserStorage.setInteractionInProgress(!1),i.end({success:!0,isNativeBroker:!0,accountType:re(s.account)}),s)).catch(s=>{if(s instanceof oe&&Ne(s))return this.nativeExtensionProvider=void 0,this.createPopupClient(t).acquireToken(e);if(s instanceof ee)return this.logger.verbose("acquireTokenPopup - Resolving interaction required error thrown by native broker by falling back to web flow"),this.createPopupClient(t).acquireToken(e);throw this.browserStorage.setInteractionInProgress(!1),s}):r=this.createPopupClient(t).acquireToken(e),r.then(s=>(a.length<this.getAllAccounts().length?this.eventHandler.emitEvent(k.LOGIN_SUCCESS,I.Popup,s):this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_SUCCESS,I.Popup,s),i.end({success:!0,accessTokenSize:s.accessToken.length,idTokenSize:s.idToken.length,accountType:re(s.account)}),s)).catch(s=>(a.length>0?this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_FAILURE,I.Popup,null,s):this.eventHandler.emitEvent(k.LOGIN_FAILURE,I.Popup,null,s),i.end({success:!1},s),Promise.reject(s)))}trackPageVisibilityWithMeasurement(){const e=this.ssoSilentMeasurement||this.acquireTokenByCodeAsyncMeasurement;e&&(this.logger.info("Perf: Visibility change detected in ",e.event.name),e.increment({visibilityChangeCount:1}))}async ssoSilent(e){var r,s;const t=this.getRequestCorrelationId(e),i={...e,prompt:e.prompt,correlationId:t};this.ssoSilentMeasurement=this.performanceClient.startMeasurement(g.SsoSilent,t),(r=this.ssoSilentMeasurement)==null||r.add({scenarioId:e.scenarioId,accountType:re(e.account)}),ut(this.initialized,this.ssoSilentMeasurement),(s=this.ssoSilentMeasurement)==null||s.increment({visibilityChangeCount:0}),document.addEventListener("visibilitychange",this.trackPageVisibilityWithMeasurement),this.logger.verbose("ssoSilent called",t),this.eventHandler.emitEvent(k.SSO_SILENT_START,I.Silent,i);let a;return this.canUseNative(i)?a=this.acquireTokenNative(i,$.ssoSilent).catch(n=>{if(n instanceof oe&&Ne(n))return this.nativeExtensionProvider=void 0,this.createSilentIframeClient(i.correlationId).acquireToken(i);throw n}):a=this.createSilentIframeClient(i.correlationId).acquireToken(i),a.then(n=>{var c;return this.eventHandler.emitEvent(k.SSO_SILENT_SUCCESS,I.Silent,n),(c=this.ssoSilentMeasurement)==null||c.end({success:!0,isNativeBroker:n.fromNativeBroker,accessTokenSize:n.accessToken.length,idTokenSize:n.idToken.length,accountType:re(n.account)}),n}).catch(n=>{var c;throw this.eventHandler.emitEvent(k.SSO_SILENT_FAILURE,I.Silent,null,n),(c=this.ssoSilentMeasurement)==null||c.end({success:!1},n),n}).finally(()=>{document.removeEventListener("visibilitychange",this.trackPageVisibilityWithMeasurement)})}async acquireTokenByCode(e){const t=this.getRequestCorrelationId(e);this.logger.trace("acquireTokenByCode called",t);const i=this.performanceClient.startMeasurement(g.AcquireTokenByCode,t);ut(this.initialized,i),this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_BY_CODE_START,I.Silent,e),i.add({scenarioId:e.scenarioId});try{if(e.code&&e.nativeAccountId)throw A(es);if(e.code){const a=e.code;let r=this.hybridAuthCodeResponses.get(a);return r?(this.logger.verbose("Existing acquireTokenByCode request found",t),i.discard()):(this.logger.verbose("Initiating new acquireTokenByCode request",t),r=this.acquireTokenByCodeAsync({...e,correlationId:t}).then(s=>(this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_BY_CODE_SUCCESS,I.Silent,s),this.hybridAuthCodeResponses.delete(a),i.end({success:!0,isNativeBroker:s.fromNativeBroker,accessTokenSize:s.accessToken.length,idTokenSize:s.idToken.length,accountType:re(s.account)}),s)).catch(s=>{throw this.hybridAuthCodeResponses.delete(a),this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_BY_CODE_FAILURE,I.Silent,null,s),i.end({success:!1},s),s}),this.hybridAuthCodeResponses.set(a,r)),await r}else if(e.nativeAccountId)if(this.canUseNative(e,e.nativeAccountId)){const a=await this.acquireTokenNative({...e,correlationId:t},$.acquireTokenByCode,e.nativeAccountId).catch(r=>{throw r instanceof oe&&Ne(r)&&(this.nativeExtensionProvider=void 0),r});return i.end({accountType:re(a.account),success:!0}),a}else throw A(ts);else throw A(Zr)}catch(a){throw this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_BY_CODE_FAILURE,I.Silent,null,a),i.end({success:!1},a),a}}async acquireTokenByCodeAsync(e){var a;return this.logger.trace("acquireTokenByCodeAsync called",e.correlationId),this.acquireTokenByCodeAsyncMeasurement=this.performanceClient.startMeasurement(g.AcquireTokenByCodeAsync,e.correlationId),(a=this.acquireTokenByCodeAsyncMeasurement)==null||a.increment({visibilityChangeCount:0}),document.addEventListener("visibilitychange",this.trackPageVisibilityWithMeasurement),await this.createSilentAuthCodeClient(e.correlationId).acquireToken(e).then(r=>{var s;return(s=this.acquireTokenByCodeAsyncMeasurement)==null||s.end({success:!0,fromCache:r.fromCache,isNativeBroker:r.fromNativeBroker}),r}).catch(r=>{var s;throw(s=this.acquireTokenByCodeAsyncMeasurement)==null||s.end({success:!1},r),r}).finally(()=>{document.removeEventListener("visibilitychange",this.trackPageVisibilityWithMeasurement)})}async acquireTokenFromCache(e,t){switch(this.performanceClient.addQueueMeasurement(g.AcquireTokenFromCache,e.correlationId),t){case J.Default:case J.AccessToken:case J.AccessTokenAndRefreshToken:const i=this.createSilentCacheClient(e.correlationId);return b(i.acquireToken.bind(i),g.SilentCacheClientAcquireToken,this.logger,this.performanceClient,e.correlationId)(e);default:throw y(me)}}async acquireTokenByRefreshToken(e,t){switch(this.performanceClient.addQueueMeasurement(g.AcquireTokenByRefreshToken,e.correlationId),t){case J.Default:case J.AccessTokenAndRefreshToken:case J.RefreshToken:case J.RefreshTokenAndNetwork:const i=this.createSilentRefreshClient(e.correlationId);return b(i.acquireToken.bind(i),g.SilentRefreshClientAcquireToken,this.logger,this.performanceClient,e.correlationId)(e);default:throw y(me)}}async acquireTokenBySilentIframe(e){this.performanceClient.addQueueMeasurement(g.AcquireTokenBySilentIframe,e.correlationId);const t=this.createSilentIframeClient(e.correlationId);return b(t.acquireToken.bind(t),g.SilentIframeClientAcquireToken,this.logger,this.performanceClient,e.correlationId)(e)}async logout(e){const t=this.getRequestCorrelationId(e);return this.logger.warning("logout API is deprecated and will be removed in msal-browser v3.0.0. Use logoutRedirect instead.",t),this.logoutRedirect({correlationId:t,...e})}async logoutRedirect(e){const t=this.getRequestCorrelationId(e);return Ra(this.initialized,this.config),this.browserStorage.setInteractionInProgress(!0),this.createRedirectClient(t).logout(e)}logoutPopup(e){try{const t=this.getRequestCorrelationId(e);return ji(this.initialized),this.browserStorage.setInteractionInProgress(!0),this.createPopupClient(t).logout(e)}catch(t){return Promise.reject(t)}}async clearCache(e){if(!this.isBrowserEnvironment){this.logger.info("in non-browser environment, returning early.");return}const t=this.getRequestCorrelationId(e);return this.createSilentCacheClient(t).logout(e)}getAllAccounts(e){const t=this.getRequestCorrelationId();return wc(this.logger,this.browserStorage,this.isBrowserEnvironment,t,e)}getAccount(e){const t=this.getRequestCorrelationId();return Ac(e,this.logger,this.browserStorage,t)}getAccountByUsername(e){const t=this.getRequestCorrelationId();return Tc(e,this.logger,this.browserStorage,t)}getAccountByHomeId(e){const t=this.getRequestCorrelationId();return Ic(e,this.logger,this.browserStorage,t)}getAccountByLocalId(e){const t=this.getRequestCorrelationId();return kc(e,this.logger,this.browserStorage,t)}setActiveAccount(e){const t=this.getRequestCorrelationId();Ec(e,this.browserStorage,t)}getActiveAccount(){const e=this.getRequestCorrelationId();return Sc(this.browserStorage,e)}async hydrateCache(e,t){this.logger.verbose("hydrateCache called");const i=z.createFromAccountInfo(e.account,e.cloudGraphHostName,e.msGraphHost);return this.browserStorage.setAccount(i,e.correlationId),e.fromNativeBroker?(this.logger.verbose("Response was from native broker, storing in-memory"),this.nativeInternalStorage.hydrateCache(e,t)):this.browserStorage.hydrateCache(e,t)}async acquireTokenNative(e,t,i){if(this.logger.trace("acquireTokenNative called"),!this.nativeExtensionProvider)throw A(it);return new Ue(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,t,this.performanceClient,this.nativeExtensionProvider,i||this.getNativeAccountId(e),this.nativeInternalStorage,e.correlationId).acquireToken(e)}canUseNative(e,t){if(this.logger.trace("canUseNative called"),!ce.isNativeAvailable(this.config,this.logger,this.nativeExtensionProvider,e.authenticationScheme))return this.logger.trace("canUseNative: isNativeAvailable returned false, returning false"),!1;if(e.prompt)switch(e.prompt){case F.NONE:case F.CONSENT:case F.LOGIN:this.logger.trace("canUseNative: prompt is compatible with native flow");break;default:return this.logger.trace(`canUseNative: prompt = ${e.prompt} is not compatible with native flow, returning false`),!1}return!t&&!this.getNativeAccountId(e)?(this.logger.trace("canUseNative: nativeAccountId is not available, returning false"),!1):!0}getNativeAccountId(e){const t=e.account||this.getAccount({loginHint:e.loginHint,sid:e.sid})||this.getActiveAccount();return t&&t.nativeAccountId||""}createPopupClient(e){return new Gc(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,this.performanceClient,this.nativeInternalStorage,this.nativeExtensionProvider,e)}createRedirectClient(e){return new jc(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,this.performanceClient,this.nativeInternalStorage,this.nativeExtensionProvider,e)}createSilentIframeClient(e){return new Xc(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,$.ssoSilent,this.performanceClient,this.nativeInternalStorage,this.nativeExtensionProvider,e)}createSilentCacheClient(e){return new As(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,this.performanceClient,this.nativeExtensionProvider,e)}createSilentRefreshClient(e){return new Zc(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,this.performanceClient,this.nativeExtensionProvider,e)}createSilentAuthCodeClient(e){return new il(this.config,this.browserStorage,this.browserCrypto,this.logger,this.eventHandler,this.navigationClient,$.acquireTokenByCode,this.performanceClient,this.nativeExtensionProvider,e)}addEventCallback(e,t){return this.eventHandler.addEventCallback(e,t)}removeEventCallback(e){this.eventHandler.removeEventCallback(e)}addPerformanceCallback(e){return fs(),this.performanceClient.addPerformanceCallback(e)}removePerformanceCallback(e){return this.performanceClient.removePerformanceCallback(e)}enableAccountStorageEvents(){typeof window>"u"||(this.listeningToStorageEvents?this.logger.verbose("Account storage listener already registered."):(this.logger.verbose("Adding account storage listener."),this.listeningToStorageEvents=!0,window.addEventListener("storage",this.handleAccountCacheChange)))}disableAccountStorageEvents(){typeof window>"u"||(this.listeningToStorageEvents?(this.logger.verbose("Removing account storage listener."),window.removeEventListener("storage",this.handleAccountCacheChange),this.listeningToStorageEvents=!1):this.logger.verbose("No account storage listener registered."))}handleAccountCacheChange(e){var t;try{(t=e.key)!=null&&t.includes(q.ACTIVE_ACCOUNT_FILTERS)&&this.eventHandler.emitEvent(k.ACTIVE_ACCOUNT_CHANGED);const i=e.newValue||e.oldValue;if(!i)return;const a=JSON.parse(i);if(typeof a!="object"||!z.isAccountEntity(a))return;const s=wt.toObject(new z,a).getAccountInfo();!e.oldValue&&e.newValue?(this.logger.info("Account was added to cache in a different window"),this.eventHandler.emitEvent(k.ACCOUNT_ADDED,void 0,s)):!e.newValue&&e.oldValue&&(this.logger.info("Account was removed from cache in a different window"),this.eventHandler.emitEvent(k.ACCOUNT_REMOVED,void 0,s))}catch{return}}getTokenCache(){return this.tokenCache}getLogger(){return this.logger}setLogger(e){this.logger=e}initializeWrapperLibrary(e,t){this.browserStorage.setWrapperMetadata(e,t)}setNavigationClient(e){this.navigationClient=e}getConfiguration(){return this.config}getPerformanceClient(){return this.performanceClient}isBrowserEnv(){return this.isBrowserEnvironment}getRequestCorrelationId(e){return e!=null&&e.correlationId?e.correlationId:this.isBrowserEnvironment?ue():f.EMPTY_STRING}async loginRedirect(e){const t=this.getRequestCorrelationId(e);return this.logger.verbose("loginRedirect called",t),this.acquireTokenRedirect({correlationId:t,...e||ka})}loginPopup(e){const t=this.getRequestCorrelationId(e);return this.logger.verbose("loginPopup called",t),this.acquireTokenPopup({correlationId:t,...e||ka})}async acquireTokenSilent(e){const t=this.getRequestCorrelationId(e),i=this.performanceClient.startMeasurement(g.AcquireTokenSilent,t);i.add({cacheLookupPolicy:e.cacheLookupPolicy,scenarioId:e.scenarioId}),ut(this.initialized,i),this.logger.verbose("acquireTokenSilent called",t);const a=e.account||this.getActiveAccount();if(!a)throw A(jr);i.add({accountType:re(a)});const r={clientId:this.config.auth.clientId,authority:e.authority||f.EMPTY_STRING,scopes:e.scopes,homeAccountIdentifier:a.homeAccountId,claims:e.claims,authenticationScheme:e.authenticationScheme,resourceRequestMethod:e.resourceRequestMethod,resourceRequestUri:e.resourceRequestUri,shrClaims:e.shrClaims,sshKid:e.sshKid,shrOptions:e.shrOptions},s=JSON.stringify(r),n=this.activeSilentTokenRequests.get(s);if(typeof n>"u"){this.logger.verbose("acquireTokenSilent called for the first time, storing active request",t);const c=b(this.acquireTokenSilentAsync.bind(this),g.AcquireTokenSilentAsync,this.logger,this.performanceClient,t)({...e,correlationId:t},a).then(l=>(this.activeSilentTokenRequests.delete(s),i.end({success:!0,fromCache:l.fromCache,isNativeBroker:l.fromNativeBroker,cacheLookupPolicy:e.cacheLookupPolicy,accessTokenSize:l.accessToken.length,idTokenSize:l.idToken.length}),l)).catch(l=>{throw this.activeSilentTokenRequests.delete(s),i.end({success:!1},l),l});return this.activeSilentTokenRequests.set(s,c),{...await c,state:e.state}}else return this.logger.verbose("acquireTokenSilent has been called previously, returning the result from the first call",t),i.discard(),{...await n,state:e.state}}async acquireTokenSilentAsync(e,t){const i=()=>this.trackPageVisibility(e.correlationId);this.performanceClient.addQueueMeasurement(g.AcquireTokenSilentAsync,e.correlationId),this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_START,I.Silent,e),e.correlationId&&this.performanceClient.incrementFields({visibilityChangeCount:0},e.correlationId),document.addEventListener("visibilitychange",i);const a=await b(Nc,g.InitializeSilentRequest,this.logger,this.performanceClient,e.correlationId)(e,t,this.config,this.performanceClient,this.logger),r=e.cacheLookupPolicy||J.Default;return this.acquireTokenSilentNoIframe(a,r).catch(async n=>{if(al(n,r))if(this.activeIframeRequest)if(r!==J.Skip){const[l,d]=this.activeIframeRequest;this.logger.verbose(`Iframe request is already in progress, awaiting resolution for request with correlationId: ${d}`,a.correlationId);const u=this.performanceClient.startMeasurement(g.AwaitConcurrentIframe,a.correlationId);u.add({awaitIframeCorrelationId:d});const p=await l;if(u.end({success:p}),p)return this.logger.verbose(`Parallel iframe request with correlationId: ${d} succeeded. Retrying cache and/or RT redemption`,a.correlationId),this.acquireTokenSilentNoIframe(a,r);throw this.logger.info(`Iframe request with correlationId: ${d} failed. Interaction is required.`),n}else return this.logger.warning("Another iframe request is currently in progress and CacheLookupPolicy is set to Skip. This may result in degraded performance and/or reliability for both calls. Please consider changing the CacheLookupPolicy to take advantage of request queuing and token cache.",a.correlationId),b(this.acquireTokenBySilentIframe.bind(this),g.AcquireTokenBySilentIframe,this.logger,this.performanceClient,a.correlationId)(a);else{let l;return this.activeIframeRequest=[new Promise(d=>{l=d}),a.correlationId],this.logger.verbose("Refresh token expired/invalid or CacheLookupPolicy is set to Skip, attempting acquire token by iframe.",a.correlationId),b(this.acquireTokenBySilentIframe.bind(this),g.AcquireTokenBySilentIframe,this.logger,this.performanceClient,a.correlationId)(a).then(d=>(l(!0),d)).catch(d=>{throw l(!1),d}).finally(()=>{this.activeIframeRequest=void 0})}else throw n}).then(n=>(this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_SUCCESS,I.Silent,n),e.correlationId&&this.performanceClient.addFields({fromCache:n.fromCache,isNativeBroker:n.fromNativeBroker},e.correlationId),n)).catch(n=>{throw this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_FAILURE,I.Silent,null,n),n}).finally(()=>{document.removeEventListener("visibilitychange",i)})}async acquireTokenSilentNoIframe(e,t){return ce.isNativeAvailable(this.config,this.logger,this.nativeExtensionProvider,e.authenticationScheme)&&e.account.nativeAccountId?(this.logger.verbose("acquireTokenSilent - attempting to acquire token from native platform"),this.acquireTokenNative(e,$.acquireTokenSilent_silentFlow).catch(async i=>{throw i instanceof oe&&Ne(i)?(this.logger.verbose("acquireTokenSilent - native platform unavailable, falling back to web flow"),this.nativeExtensionProvider=void 0,y(me)):i})):(this.logger.verbose("acquireTokenSilent - attempting to acquire token from web flow"),b(this.acquireTokenFromCache.bind(this),g.AcquireTokenFromCache,this.logger,this.performanceClient,e.correlationId)(e,t).catch(i=>{if(t===J.AccessToken)throw i;return this.eventHandler.emitEvent(k.ACQUIRE_TOKEN_NETWORK_START,I.Silent,e),b(this.acquireTokenByRefreshToken.bind(this),g.AcquireTokenByRefreshToken,this.logger,this.performanceClient,e.correlationId)(e,t)}))}}function al(o,e){const t=!(o instanceof ee&&o.subError!==_t),i=o.errorCode===Q.INVALID_GRANT_ERROR||o.errorCode===me,a=t&&i||o.errorCode===At||o.errorCode===_i,r=Ho.includes(e);return a&&r}/*! @azure/msal-browser v3.30.0 2025-08-05 */async function rl(o,e){const t=new Ee(o);return await t.initialize(),Dt.createController(t,e)}/*! @azure/msal-browser v3.30.0 2025-08-05 */class Ji{static async createPublicClientApplication(e){const t=await rl(e);return new Ji(e,t)}constructor(e,t){this.controller=t||new Dt(new Ee(e))}async initialize(e){return this.controller.initialize(e)}async acquireTokenPopup(e){return this.controller.acquireTokenPopup(e)}acquireTokenRedirect(e){return this.controller.acquireTokenRedirect(e)}acquireTokenSilent(e){return this.controller.acquireTokenSilent(e)}acquireTokenByCode(e){return this.controller.acquireTokenByCode(e)}addEventCallback(e,t){return this.controller.addEventCallback(e,t)}removeEventCallback(e){return this.controller.removeEventCallback(e)}addPerformanceCallback(e){return this.controller.addPerformanceCallback(e)}removePerformanceCallback(e){return this.controller.removePerformanceCallback(e)}enableAccountStorageEvents(){this.controller.enableAccountStorageEvents()}disableAccountStorageEvents(){this.controller.disableAccountStorageEvents()}getAccount(e){return this.controller.getAccount(e)}getAccountByHomeId(e){return this.controller.getAccountByHomeId(e)}getAccountByLocalId(e){return this.controller.getAccountByLocalId(e)}getAccountByUsername(e){return this.controller.getAccountByUsername(e)}getAllAccounts(e){return this.controller.getAllAccounts(e)}handleRedirectPromise(e){return this.controller.handleRedirectPromise(e)}loginPopup(e){return this.controller.loginPopup(e)}loginRedirect(e){return this.controller.loginRedirect(e)}logout(e){return this.controller.logout(e)}logoutRedirect(e){return this.controller.logoutRedirect(e)}logoutPopup(e){return this.controller.logoutPopup(e)}ssoSilent(e){return this.controller.ssoSilent(e)}getTokenCache(){return this.controller.getTokenCache()}getLogger(){return this.controller.getLogger()}setLogger(e){this.controller.setLogger(e)}setActiveAccount(e){this.controller.setActiveAccount(e)}getActiveAccount(){return this.controller.getActiveAccount()}initializeWrapperLibrary(e,t){return this.controller.initializeWrapperLibrary(e,t)}setNavigationClient(e){this.controller.setNavigationClient(e)}getConfiguration(){return this.controller.getConfiguration()}async hydrateCache(e,t){return this.controller.hydrateCache(e,t)}clearCache(e){return this.controller.clearCache(e)}}function sl(){const o=Lt();return o&&o.clientId&&o.tenantId?(console.log("Using bootstrapped app configuration"),{auth:{clientId:o.clientId,authority:`https://login.microsoftonline.com/${o.tenantId}`,redirectUri:window.location.origin,postLogoutRedirectUri:window.location.origin,navigateToLoginRequestUrl:!0},cache:{cacheLocation:"sessionStorage",storeAuthStateInCookie:!1},system:{loggerOptions:{logLevel:3,loggerCallback:(e,t,i)=>{if(!i)switch(e){case 0:console.error(t);break;case 1:console.warn(t);break;case 2:console.info(t);break;case 3:console.debug(t);break}}}}}):(console.log("No saved config found - will need to bootstrap or configure manually"),null)}function Lt(){const o=localStorage.getItem("pimbuddy-app-config");if(o)try{return JSON.parse(o)}catch{return null}return null}function ks(){const o=Lt();return o&&o.clientId&&o.tenantId}function nl(){localStorage.removeItem("pimbuddy-app-config")}const Bt={user:["User.Read"],groups:["Group.Read.All","Group.ReadWrite.All"],pimGroups:["PrivilegedAccess.Read.AzureADGroup","PrivilegedAccess.ReadWrite.AzureADGroup","PrivilegedEligibilitySchedule.Read.AzureADGroup","PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup","PrivilegedAssignmentSchedule.Read.AzureADGroup","PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup"],roles:["RoleManagement.Read.Directory","RoleManagement.ReadWrite.Directory"],all:["User.Read","Group.Read.All","Group.ReadWrite.All","RoleManagement.Read.Directory","RoleManagement.ReadWrite.Directory","PrivilegedAccess.Read.AzureADGroup","PrivilegedAccess.ReadWrite.AzureADGroup","PrivilegedEligibilitySchedule.Read.AzureADGroup","PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup","PrivilegedAssignmentSchedule.Read.AzureADGroup","PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup"]};class ol{constructor(){this.msalInstance=null,this.account=null,this.initialized=!1}isConfigured(){return ks()}async initialize(){if(this.initialized)return!0;const e=sl();if(!e)return console.log("MSAL not configured - bootstrap required"),!1;try{this.msalInstance=new Ji(e),await this.msalInstance.initialize();const t=await this.msalInstance.handleRedirectPromise();if(t)this.account=t.account;else{const i=this.msalInstance.getAllAccounts();i.length>0&&(this.account=i[0])}return this.initialized=!0,console.log("MSAL initialized successfully"),!0}catch(t){throw console.error("MSAL initialization failed:",t),t}}async reinitialize(){return this.msalInstance=null,this.account=null,this.initialized=!1,await this.initialize()}isAuthenticated(){return this.account!==null}getAccount(){return this.account}async login(){if(!this.msalInstance)return{success:!1,error:"App not configured. Please run setup first."};try{const e=await this.msalInstance.loginPopup({scopes:Bt.all,prompt:"select_account"});return this.account=e.account,{success:!0,account:this.account}}catch(e){return console.error("Login failed:",e),{success:!1,error:this.getFriendlyError(e)}}}async loginRedirect(){if(!this.msalInstance)throw new Error("App not configured");try{await this.msalInstance.loginRedirect({scopes:Bt.all})}catch(e){throw console.error("Login redirect failed:",e),e}}async logout(){if(!this.msalInstance)return this.account=null,{success:!0};try{return await this.msalInstance.logoutPopup({account:this.account,postLogoutRedirectUri:window.location.origin}),this.account=null,{success:!0}}catch(e){return console.error("Logout failed:",e),{success:!1,error:this.getFriendlyError(e)}}}async getAccessToken(e=Bt.all){if(!this.account)throw new Error("No account found. Please login first.");const t={scopes:e,account:this.account};try{return(await this.msalInstance.acquireTokenSilent(t)).accessToken}catch(i){if(i instanceof ee)try{return(await this.msalInstance.acquireTokenPopup(t)).accessToken}catch(a){throw console.error("Token acquisition failed:",a),a}throw i}}getFriendlyError(e){const t=e.message||e.toString();return t.includes("user_cancelled")?"Login was cancelled.":t.includes("consent_required")?"Admin consent is required for this application.":t.includes("interaction_required")?"Please sign in again.":t.includes("invalid_client")?"Application configuration error. Please check client ID.":t.includes("unauthorized_client")?"This application is not authorized in your tenant.":t.includes("AADSTS700016")?"Application not found. You may need to run setup again.":t}}const se=new ol;class H{static encodeODataFilter(e){return e?e.replace(/'/g,"''").replace(/\\/g,"\\\\").replace(/\$/g,"\\$").replace(/\(/g,"\\(").replace(/\)/g,"\\)"):""}static buildODataFilter(e,t,i){const a=this.encodeODataFilter(i);if(!["eq","ne","gt","ge","lt","le","startswith","endswith","contains"].includes(t.toLowerCase()))throw new Error(`Invalid OData operator: ${t}`);return["startswith","endswith","contains"].includes(t.toLowerCase())?`${t}(${e},'${a}')`:`${e} ${t} '${a}'`}static escapeHtml(e){if(e==null)return"";typeof e!="string"&&(e=String(e));const t=document.createElement("div");return t.textContent=e,t.innerHTML}static escapeHtmlAttribute(e){return e==null?"":(typeof e!="string"&&(e=String(e)),e.replace(/&/g,"&amp;").replace(/'/g,"&#39;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;"))}static sanitizeUrl(e){if(!e)return"";const t=e.trim().toLowerCase();return["javascript:","data:","vbscript:","file:"].some(a=>t.startsWith(a))?(console.warn(`Blocked dangerous URL: ${e}`),""):e}static validateInput(e,t={}){const{maxLength:i=1e3,minLength:a=0,allowedChars:r=null,required:s=!1}=t;return s&&(!e||e.trim().length===0)?{valid:!1,error:"This field is required",sanitized:""}:e&&e.length>i?{valid:!1,error:`Maximum length is ${i} characters`,sanitized:e.substring(0,i)}:e&&e.length<a?{valid:!1,error:`Minimum length is ${a} characters`,sanitized:e}:r&&e&&!new RegExp(r).test(e)?{valid:!1,error:"Input contains invalid characters",sanitized:e}:{valid:!0,sanitized:e||"",error:null}}}class cl{constructor(){this.requests=new Map,this.limits={default:{maxRequests:60,windowMs:6e4},search:{maxRequests:30,windowMs:6e4},mutation:{maxRequests:20,windowMs:6e4}}}isAllowed(e,t="default"){const i=Date.now(),a=this.limits[t]||this.limits.default;this.requests.has(e)||this.requests.set(e,[]);const s=this.requests.get(e).filter(n=>i-n<a.windowMs);return s.length>=a.maxRequests?!1:(s.push(i),this.requests.set(e,s),!0)}getResetTime(e,t="default"){const i=this.limits[t]||this.limits.default;if(!this.requests.has(e))return 0;const a=this.requests.get(e);if(a.length===0)return 0;const s=Math.min(...a)+i.windowMs,n=Date.now();return Math.max(0,Math.ceil((s-n)/1e3))}clear(e){this.requests.delete(e)}clearAll(){this.requests.clear()}}class ll{constructor(e=15,t=10){this.timeoutMs=e*60*1e3,this.warningMs=t*60*1e3,this.lastActivity=Date.now(),this.warningShown=!1,this.timeoutCallback=null,this.warningCallback=null,this.checkInterval=null}start(e,t){this.timeoutCallback=e,this.warningCallback=t,this.lastActivity=Date.now(),this.warningShown=!1,["mousedown","keydown","scroll","touchstart"].forEach(i=>{document.addEventListener(i,()=>this.recordActivity(),{passive:!0})}),this.checkInterval=setInterval(()=>this.checkSession(),3e4)}recordActivity(){this.lastActivity=Date.now(),this.warningShown=!1}checkSession(){const t=Date.now()-this.lastActivity;if(t>=this.timeoutMs){this.stop(),this.timeoutCallback&&this.timeoutCallback();return}if(t>=this.warningMs&&!this.warningShown&&(this.warningShown=!0,this.warningCallback)){const i=Math.ceil((this.timeoutMs-t)/6e4);this.warningCallback(i)}}stop(){this.checkInterval&&(clearInterval(this.checkInterval),this.checkInterval=null)}reset(){this.lastActivity=Date.now(),this.warningShown=!1}getRemainingMinutes(){const t=Date.now()-this.lastActivity,i=this.timeoutMs-t;return Math.max(0,Math.ceil(i/6e4))}}const Na=new cl,Oa=new ll(15,10),Le=class Le{constructor(){this.baseUrl="https://graph.microsoft.com/v1.0",this.betaUrl="https://graph.microsoft.com/beta"}async request(e,t={}){var c,l;const a=(t.method||"GET")==="GET"?e.includes("$filter")||e.includes("$search")?"search":"default":"mutation";if(!Na.isAllowed(e,a)){const d=Na.getResetTime(e,a),u=new Error(`Rate limit exceeded. Try again in ${d} seconds.`);throw u.code="RATE_LIMIT_EXCEEDED",u.resetTime=d,u}const s={Authorization:`Bearer ${await se.getAccessToken()}`,"Content-Type":"application/json"},n=await fetch(e,{...t,headers:{...s,...t.headers}});if(!n.ok){const d=await n.json().catch(()=>({})),u=new Error(((c=d.error)==null?void 0:c.message)||`HTTP ${n.status}`);throw u.status=n.status,u.code=(l=d.error)==null?void 0:l.code,u}return n.status===204?null:n.json()}async get(e){return this.request(e,{method:"GET"})}async getWithCustomHeaders(e,t={}){return this.request(e,{method:"GET",headers:t})}async post(e,t){return this.request(e,{method:"POST",body:JSON.stringify(t)})}async patch(e,t){return this.request(e,{method:"PATCH",body:JSON.stringify(t)})}async delete(e){return this.request(e,{method:"DELETE"})}async batch(e){if(!e||e.length===0)return{};const i=this.chunkArray(e,20),a={};for(const r of i)try{const s={requests:r.map((c,l)=>({id:c.id||`${l}`,method:c.method||"GET",url:c.url,headers:c.headers||{}}))},n=await this.post(`${this.baseUrl}/$batch`,s);n&&n.responses&&n.responses.forEach(c=>{a[c.id]={status:c.status,body:c.body}})}catch(s){console.error("Batch request failed:",s),r.forEach(n=>{a[n.id]={status:500,body:{error:{message:s.message}}}})}return a}chunkArray(e,t){const i=[];for(let a=0;a<e.length;a+=t)i.push(e.slice(a,a+t));return i}async getMe(){return this.get(`${this.baseUrl}/me`)}async getPIMGroups(){try{const t=(await this.get(`${this.baseUrl}/groups?$filter=isAssignableToRole eq true&$select=id,displayName,description,createdDateTime,mailNickname`)).value||[];if(t.length===0)return{success:!0,groups:[],count:0};const i=[];t.forEach((s,n)=>{i.push({id:`${n}-members`,method:"GET",url:`/groups/${s.id}/members/$count`,headers:{ConsistencyLevel:"eventual"}}),i.push({id:`${n}-owners`,method:"GET",url:`/groups/${s.id}/owners/$count`,headers:{ConsistencyLevel:"eventual"}})});const a=await this.batch(i),r=t.map((s,n)=>{const c=a[`${n}-members`],l=a[`${n}-owners`],d=(c==null?void 0:c.status)===200&&typeof c.body=="number"?c.body:0,u=(l==null?void 0:l.status)===200&&typeof l.body=="number"?l.body:0;return{...s,memberCount:d,ownerCount:u}});return{success:!0,groups:r,count:r.length}}catch(e){return console.error("Failed to fetch PIM groups:",e),{success:!1,error:this.getFriendlyError(e),groups:[]}}}async getGroupsPage(e=1,t=50){try{const i=(e-1)*t,a=await this.getWithCustomHeaders(`${this.baseUrl}/groups?$filter=isAssignableToRole eq true&$select=id,displayName,description,createdDateTime,mailNickname&$top=${t}&$skip=${i}&$count=true`,{ConsistencyLevel:"eventual"}),r=a.value||[],s=a["@odata.count"]||0;if(r.length===0)return{success:!0,items:[],totalCount:0,pageNumber:e,pageSize:t,totalPages:0};const n=[];r.forEach((d,u)=>{n.push({id:`${u}-members`,method:"GET",url:`/groups/${d.id}/members/$count`,headers:{ConsistencyLevel:"eventual"}}),n.push({id:`${u}-owners`,method:"GET",url:`/groups/${d.id}/owners/$count`,headers:{ConsistencyLevel:"eventual"}})});const c=await this.batch(n);return{success:!0,items:r.map((d,u)=>{const p=c[`${u}-members`],h=c[`${u}-owners`],m=(p==null?void 0:p.status)===200&&typeof p.body=="number"?p.body:0,v=(h==null?void 0:h.status)===200&&typeof h.body=="number"?h.body:0;return{...d,memberCount:m,ownerCount:v}}),totalCount:s,pageNumber:e,pageSize:t,totalPages:Math.ceil(s/t)}}catch(i){return console.error("Failed to fetch groups page:",i),{success:!1,error:this.getFriendlyError(i),items:[],totalCount:0,pageNumber:e,pageSize:t,totalPages:0}}}async createPIMGroup(e,t,i){try{return{success:!0,group:await this.post(`${this.baseUrl}/groups`,{displayName:e,description:t,mailNickname:i||e.replace(/[^a-zA-Z0-9]/g,""),mailEnabled:!1,securityEnabled:!0,isAssignableToRole:!0,groupTypes:[]})}}catch(a){return console.error("Failed to create group:",a),{success:!1,error:this.getFriendlyError(a)}}}async deleteGroup(e){try{return await this.delete(`${this.baseUrl}/groups/${e}`),{success:!0}}catch(t){return{success:!1,error:this.getFriendlyError(t)}}}async getGroupMembers(e){try{return{success:!0,members:(await this.get(`${this.baseUrl}/groups/${e}/members?$select=id,displayName,userPrincipalName,mail`)).value||[]}}catch(t){return{success:!1,error:this.getFriendlyError(t),members:[]}}}async addGroupMember(e,t){try{return await this.post(`${this.baseUrl}/groups/${e}/members/$ref`,{"@odata.id":`https://graph.microsoft.com/v1.0/directoryObjects/${t}`}),{success:!0}}catch(i){return{success:!1,error:this.getFriendlyError(i)}}}async removeGroupMember(e,t){try{return await this.delete(`${this.baseUrl}/groups/${e}/members/${t}/$ref`),{success:!0}}catch(i){return{success:!1,error:this.getFriendlyError(i)}}}async getGroupPolicy(e,t="member"){var i;try{const a=await this.get(`${this.baseUrl}/policies/roleManagementPolicyAssignments?$filter=scopeId eq '${e}' and scopeType eq 'Group' and roleDefinitionId eq '${t}'`);if(!a.value||a.value.length===0)return{success:!1,error:"No PIM policy found for this group",isDefault:!0};const s=a.value[0].policyId,c=(await this.get(`${this.baseUrl}/policies/roleManagementPolicies/${s}/rules`)).value||[],l=this.parseRulesToSettings(c);return{success:!0,policyId:s,settings:l,rawRules:c}}catch(a){return a.status===403&&((i=a.message)!=null&&i.includes("RoleManagementPolicy"))?{success:!1,error:"PIM for Groups not configured (requires additional permissions)",requiresPermissions:!0,missingPermissions:["RoleManagementPolicy.Read.AzureADGroup"]}:(console.error("Failed to get group policy:",a),{success:!1,error:this.getFriendlyError(a)})}}async updateGroupPolicy(e,t,i){var a,r;try{const s=await this.getGroupPolicy(e,t);if(!s.success)return s;const{policyId:n,rawRules:c}=s,l=[];for(const d of c){const u=d["@odata.type"],p=d.id;if(u==="#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"&&((a=d.target)==null?void 0:a.caller)==="EndUser"&&i.maximumDurationHours!==void 0&&l.push(this.patch(`${this.betaUrl}/policies/roleManagementPolicies/${n}/rules/${p}`,{"@odata.type":u,id:p,isExpirationRequired:!0,maximumDuration:`PT${i.maximumDurationHours}H`,target:d.target})),u==="#microsoft.graph.unifiedRoleManagementPolicyEnablementRule"&&((r=d.target)==null?void 0:r.caller)==="EndUser"){const h=[];i.requireMfa&&h.push("MultiFactorAuthentication"),i.requireJustification&&h.push("Justification"),i.requireTicketInfo&&h.push("Ticketing"),l.push(this.patch(`${this.betaUrl}/policies/roleManagementPolicies/${n}/rules/${p}`,{"@odata.type":u,id:p,enabledRules:h,target:d.target}))}u==="#microsoft.graph.unifiedRoleManagementPolicyApprovalRule"&&i.requireApproval!==void 0&&l.push(this.patch(`${this.betaUrl}/policies/roleManagementPolicies/${n}/rules/${p}`,{"@odata.type":u,id:p,setting:{isApprovalRequired:i.requireApproval,isApprovalRequiredForExtension:!1,isRequestorJustificationRequired:!0,approvalMode:"SingleStage",approvalStages:i.approverIds&&i.approverIds.length>0?[{approvalStageTimeOutInDays:1,isApproverJustificationRequired:!0,escalationTimeInMinutes:0,isEscalationEnabled:!1,primaryApprovers:i.approverIds.map(h=>({"@odata.type":"#microsoft.graph.singleUser",userId:h}))}]:[]},target:d.target}))}return await Promise.all(l),{success:!0,updatedRules:l.length}}catch(s){return console.error("Failed to update group policy:",s),{success:!1,error:this.getFriendlyError(s)}}}parseRulesToSettings(e){var i,a;const t={activation:{maximumDurationHours:8,requireMfa:!0,requireJustification:!0,requireTicketInfo:!1,requireApproval:!1,approvers:[]},eligibleAssignment:{allowPermanent:!0,maximumDurationDays:365},activeAssignment:{allowPermanent:!1,maximumDurationDays:30,requireMfa:!0,requireJustification:!0}};for(const r of e){const s=r["@odata.type"],n=r.target||{};if(s==="#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"){const c=r.maximumDuration||"PT8H",l=this.parseIsoDuration(c);n.caller==="EndUser"?t.activation.maximumDurationHours=l:n.caller==="Admin"&&n.level==="Eligibility"?(t.eligibleAssignment.allowPermanent=!r.isExpirationRequired,t.eligibleAssignment.maximumDurationDays=this.parseIsoDurationDays(c)):n.caller==="Admin"&&n.level==="Assignment"&&(t.activeAssignment.allowPermanent=!r.isExpirationRequired,t.activeAssignment.maximumDurationDays=this.parseIsoDurationDays(c))}if(s==="#microsoft.graph.unifiedRoleManagementPolicyEnablementRule"){const c=r.enabledRules||[];n.caller==="EndUser"&&(t.activation.requireMfa=c.includes("MultiFactorAuthentication"),t.activation.requireJustification=c.includes("Justification"),t.activation.requireTicketInfo=c.includes("Ticketing"))}if(s==="#microsoft.graph.unifiedRoleManagementPolicyApprovalRule"){const c=r.setting||{};t.activation.requireApproval=c.isApprovalRequired||!1,(a=(i=c.approvalStages)==null?void 0:i[0])!=null&&a.primaryApprovers&&(t.activation.approvers=c.approvalStages[0].primaryApprovers.filter(l=>l.userId).map(l=>l.userId))}}return t}parseIsoDuration(e){const t=e.match(/PT(\d+)H/);return t?parseInt(t[1]):8}parseIsoDurationDays(e){const t=e.match(/P(\d+)D/);if(t)return parseInt(t[1]);const i=e.match(/PT(\d+)H/);return i?Math.ceil(parseInt(i[1])/24):365}getRolePrivilegeLevel(e){return Le.PRIVILEGE_LEVELS.critical.includes(e)?"critical":Le.PRIVILEGE_LEVELS.high.includes(e)?"high":Le.PRIVILEGE_LEVELS.medium.includes(e)?"medium":"low"}async getRoleDefinitions(){try{return{success:!0,roles:((await this.get(`${this.baseUrl}/roleManagement/directory/roleDefinitions?$select=id,displayName,description,isBuiltIn,templateId`)).value||[]).map(i=>({...i,privilegeLevel:this.getRolePrivilegeLevel(i.templateId||i.id)}))}}catch(e){return{success:!1,error:this.getFriendlyError(e),roles:[]}}}async getRolesPage(e=1,t=50){try{const i=(e-1)*t,a=await this.getWithCustomHeaders(`${this.baseUrl}/roleManagement/directory/roleDefinitions?$select=id,displayName,description,isBuiltIn,templateId&$top=${t}&$skip=${i}&$count=true`,{ConsistencyLevel:"eventual"}),r=a["@odata.count"]||0;return{success:!0,items:(a.value||[]).map(n=>({...n,privilegeLevel:this.getRolePrivilegeLevel(n.templateId||n.id)})),totalCount:r,pageNumber:e,pageSize:t,totalPages:Math.ceil(r/t)}}catch(i){return{success:!1,error:this.getFriendlyError(i),items:[],totalCount:0,pageNumber:e,pageSize:t,totalPages:0}}}async getRolePolicy(e){try{const t=await this.get(`${this.baseUrl}/policies/roleManagementPolicyAssignments?$filter=scopeId eq '/' and scopeType eq 'DirectoryRole' and roleDefinitionId eq '${e}'`);if(!t.value||t.value.length===0)return{success:!1,error:"No policy found for this role"};const a=t.value[0].policyId,s=(await this.get(`${this.baseUrl}/policies/roleManagementPolicies/${a}/rules`)).value||[],n=this.parseRulesToSettings(s);return{success:!0,policyId:a,settings:n,rawRules:s}}catch(t){return{success:!1,error:this.getFriendlyError(t)}}}async getUserIdsByEmails(e){if(!e||e.length===0)return[];try{const t=[];for(const i of e)try{const a=await this.get(`${this.baseUrl}/users/${encodeURIComponent(i)}?$select=id`);t.push(a.id)}catch(a){console.warn(`Failed to find user ID for ${i}:`,a.message)}return t}catch(t){return console.error("Failed to convert emails to user IDs:",t),[]}}async updateRolePolicy(e,t){var i,a;try{const r=await this.getRolePolicy(e);if(!r.success)return r;const{policyId:s,rawRules:n}=r,c=[];if(t.approvers&&t.approvers.length>0&&(t.approverIds=await this.getUserIdsByEmails(t.approvers),t.approverIds.length===0))return{success:!1,error:"Could not find any of the specified approvers. Please check the email addresses."};for(const l of n){const d=l["@odata.type"],u=l.id;if(d==="#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"&&((i=l.target)==null?void 0:i.caller)==="EndUser"&&t.maximumDurationHours!==void 0&&c.push(this.patch(`${this.betaUrl}/policies/roleManagementPolicies/${s}/rules/${u}`,{"@odata.type":d,id:u,isExpirationRequired:!0,maximumDuration:`PT${t.maximumDurationHours}H`,target:l.target})),d==="#microsoft.graph.unifiedRoleManagementPolicyEnablementRule"&&((a=l.target)==null?void 0:a.caller)==="EndUser"){const p=[];t.requireMfa&&p.push("MultiFactorAuthentication"),t.requireJustification&&p.push("Justification"),t.requireTicketInfo&&p.push("Ticketing"),c.push(this.patch(`${this.betaUrl}/policies/roleManagementPolicies/${s}/rules/${u}`,{"@odata.type":d,id:u,enabledRules:p,target:l.target}))}d==="#microsoft.graph.unifiedRoleManagementPolicyApprovalRule"&&t.requireApproval!==void 0&&c.push(this.patch(`${this.betaUrl}/policies/roleManagementPolicies/${s}/rules/${u}`,{"@odata.type":d,id:u,setting:{isApprovalRequired:t.requireApproval,isApprovalRequiredForExtension:!1,isRequestorJustificationRequired:!0,approvalMode:"SingleStage",approvalStages:t.approverIds&&t.approverIds.length>0?[{approvalStageTimeOutInDays:1,isApproverJustificationRequired:!0,escalationTimeInMinutes:0,isEscalationEnabled:!1,primaryApprovers:t.approverIds.map(p=>({"@odata.type":"#microsoft.graph.singleUser",userId:p}))}]:[]},target:l.target}))}return await Promise.all(c),{success:!0,updatedRules:c.length}}catch(r){return console.error("Failed to update role policy:",r),{success:!1,error:this.getFriendlyError(r)}}}async getGroupEligibleAssignments(e){try{return{success:!0,assignments:(await this.get(`${this.baseUrl}/identityGovernance/privilegedAccess/group/eligibilityScheduleInstances?$filter=groupId eq '${e}'`)).value||[]}}catch(t){return{success:!1,error:this.getFriendlyError(t),assignments:[]}}}async getGroupActiveAssignments(e){try{return{success:!0,assignments:(await this.get(`${this.baseUrl}/identityGovernance/privilegedAccess/group/assignmentScheduleInstances?$filter=groupId eq '${e}'`)).value||[]}}catch(t){return{success:!1,error:this.getFriendlyError(t),assignments:[]}}}async getAllGroupAssignments(e){const t={};for(const i of e)try{const[a,r]=await Promise.all([this.getGroupEligibleAssignments(i.id),this.getGroupActiveAssignments(i.id)]),s=(a.assignments||[]).filter(c=>c.principalId).map(c=>{var l;return{id:c.principalId,displayName:((l=c.principal)==null?void 0:l.displayName)||"Unknown User",accessId:c.accessId}}),n=(r.assignments||[]).filter(c=>c.principalId).map(c=>{var l;return{id:c.principalId,displayName:((l=c.principal)==null?void 0:l.displayName)||"Unknown User",accessId:c.accessId}});(s.length>0||n.length>0)&&(t[i.id]={eligible:s,active:n})}catch(a){console.warn(`Failed to get assignments for group ${i.id}:`,a)}return{success:!0,assignments:t}}async getRoleEligibilityAssignments(){try{return{success:!0,assignments:(await this.get(`${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$expand=principal`)).value||[]}}catch(e){return{success:!1,error:this.getFriendlyError(e),assignments:[]}}}async getRoleActiveAssignments(){try{return{success:!0,assignments:(await this.get(`${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleInstances?$expand=principal`)).value||[]}}catch(e){return{success:!1,error:this.getFriendlyError(e),assignments:[]}}}async getAllRoleAssignments(){var e,t,i,a,r,s;try{const[n,c]=await Promise.all([this.getRoleEligibilityAssignments(),this.getRoleActiveAssignments()]),l={};for(const d of n.assignments||[]){const u=d.roleDefinitionId;l[u]||(l[u]=[]),l[u].push({principalId:d.principalId,principalDisplayName:((e=d.principal)==null?void 0:e.displayName)||"Unknown",principalType:(i=(t=d.principal)==null?void 0:t["@odata.type"])!=null&&i.includes("group")?"Group":"User",assignmentType:"Eligible",startDateTime:d.startDateTime,endDateTime:d.endDateTime})}for(const d of c.assignments||[]){const u=d.roleDefinitionId;l[u]||(l[u]=[]),l[u].push({principalId:d.principalId,principalDisplayName:((a=d.principal)==null?void 0:a.displayName)||"Unknown",principalType:(s=(r=d.principal)==null?void 0:r["@odata.type"])!=null&&s.includes("group")?"Group":"User",assignmentType:"Active",startDateTime:d.startDateTime,endDateTime:d.endDateTime})}return{success:!0,assignments:l}}catch(n){return{success:!1,error:this.getFriendlyError(n),assignments:{}}}}async createEligibleAssignment(e,t,i,a,r){try{const s={accessId:i,principalId:t,groupId:e,action:"adminAssign",scheduleInfo:{startDateTime:a||new Date().toISOString(),expiration:r?{type:"afterDateTime",endDateTime:r}:{type:"noExpiration"}}};return{success:!0,assignment:await this.post(`${this.baseUrl}/identityGovernance/privilegedAccess/group/eligibilityScheduleRequests`,s)}}catch(s){return{success:!1,error:this.getFriendlyError(s)}}}async createDirectoryRoleEligibilityAssignment(e,t,i="Baseline deployment",a=12){try{const r=new Date,s=new Date;s.setMonth(s.getMonth()+a);const n={action:"adminAssign",justification:i,roleDefinitionId:t,directoryScopeId:"/",principalId:e,scheduleInfo:{startDateTime:r.toISOString(),expiration:{type:"afterDateTime",endDateTime:s.toISOString()}}};return{success:!0,assignment:await this.post(`${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleRequests`,n)}}catch(r){return console.error("Failed to create role eligibility assignment:",r),{success:!1,error:this.getFriendlyError(r)}}}async createDirectoryRoleActiveAssignment(e,t,i="Baseline deployment - Active assignment"){try{const r={action:"adminAssign",justification:i,roleDefinitionId:t,directoryScopeId:"/",principalId:e,scheduleInfo:{startDateTime:new Date().toISOString(),expiration:{type:"noExpiration"}}};return{success:!0,assignment:await this.post(`${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,r)}}catch(a){return console.error("Failed to create role active assignment:",a),{success:!1,error:this.getFriendlyError(a)}}}async createDirectoryRoleEligibleAssignment(e,t,i,a,r){try{const s={action:"adminAssign",justification:i||"Role assignment",roleDefinitionId:t,directoryScopeId:"/",principalId:e,scheduleInfo:{startDateTime:a,expiration:r?{type:"afterDateTime",endDateTime:r}:{type:"noExpiration"}}};return{success:!0,assignment:await this.post(`${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleRequests`,s)}}catch(s){return console.error("Failed to create role eligible assignment:",s),{success:!1,error:this.getFriendlyError(s)}}}async createDirectoryRoleActiveAssignment(e,t,i,a,r){try{const s={action:"adminAssign",justification:i||"Active role assignment",roleDefinitionId:t,directoryScopeId:"/",principalId:e,scheduleInfo:{startDateTime:a,expiration:r?{type:"afterDateTime",endDateTime:r}:{type:"noExpiration"}}};return{success:!0,assignment:await this.post(`${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,s)}}catch(s){return console.error("Failed to create role active assignment:",s),{success:!1,error:this.getFriendlyError(s)}}}async searchUsers(e){try{const t=H.validateInput(e,{maxLength:200,required:!0,minLength:1});if(!t.valid)return{success:!1,error:t.error,users:[]};const i=H.buildODataFilter("displayName","startswith",t.sanitized),a=H.buildODataFilter("userPrincipalName","startswith",t.sanitized);return{success:!0,users:(await this.get(`${this.baseUrl}/users?$filter=${i} or ${a}&$select=id,displayName,userPrincipalName&$top=10`)).value||[]}}catch(t){return{success:!1,error:this.getFriendlyError(t),users:[]}}}async getPIMAuditLogs(e=7){try{const t=new Date;return t.setDate(t.getDate()-e),{success:!0,logs:(await this.get(`${this.baseUrl}/auditLogs/directoryAudits?$filter=activityDateTime ge ${t.toISOString()} and category eq 'RoleManagement'&$top=50&$orderby=activityDateTime desc`)).value||[]}}catch(t){return console.error("Failed to fetch audit logs:",t),{success:!1,error:this.getFriendlyError(t),logs:[]}}}async getPendingApprovals(){var e;try{const t=await this.get(`${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleRequests?$filter=status eq 'PendingApproval'&$expand=principal,roleDefinition`);return{success:!0,requests:t.value||[],count:((e=t.value)==null?void 0:e.length)||0}}catch(t){return console.error("Failed to fetch pending approvals:",t),{success:!1,error:this.getFriendlyError(t),requests:[],count:0}}}async reviewApprovalRequest(e,t,i){try{const a=await this.get(`${this.betaUrl}/roleManagement/directory/roleAssignmentApprovals/${e}`);if(!a.steps||a.steps.length===0)return{success:!1,error:"No approval steps found"};const r=a.steps.find(n=>n.status==="InProgress"||n.status==="NotStarted");if(!r)return{success:!1,error:"No pending approval step found. The request may have already been approved or denied."};const s=t==="approve"?"Approve":"Deny";return await this.patch(`${this.betaUrl}/roleManagement/directory/roleAssignmentApprovals/${e}/steps/${r.id}`,{reviewResult:s,justification:i}),{success:!0}}catch(a){return console.error("Failed to review approval:",a),{success:!1,error:this.getFriendlyError(a)}}}async getRoleAssignmentsWithExpiration(){try{const e=await this.get(`${this.baseUrl}/roleManagement/directory/roleAssignmentScheduleInstances?$expand=principal,roleDefinition&$top=100`),t=await this.get(`${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$expand=principal,roleDefinition&$top=100`),i=new Date,a=new Date(i.getTime()+7*24*60*60*1e3),r=(e.value||[]).map(c=>({...c,type:"active",isExpiring:c.endDateTime&&new Date(c.endDateTime)<=a})),s=(t.value||[]).map(c=>({...c,type:"eligible",isExpiring:c.endDateTime&&new Date(c.endDateTime)<=a})),n=[...r,...s].filter(c=>c.isExpiring).sort((c,l)=>new Date(c.endDateTime)-new Date(l.endDateTime));return{success:!0,activeCount:r.length,eligibleCount:s.length,expiringCount:n.length,expiringAssignments:n}}catch(e){return console.error("Failed to fetch role assignments:",e),{success:!1,error:this.getFriendlyError(e),activeCount:0,eligibleCount:0,expiringCount:0,expiringAssignments:[]}}}async getRoleCoverageReport(){try{const t=(await this.getPIMGroups()).groups||[],a=(await this.get(`${this.baseUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$expand=principal,roleDefinition&$top=200`)).value||[],r=a.filter(u=>{var p,h;return(h=(p=u.principal)==null?void 0:p["@odata.type"])==null?void 0:h.includes("group")}),s=a.filter(u=>{var p,h;return(h=(p=u.principal)==null?void 0:p["@odata.type"])==null?void 0:h.includes("user")}),n=new Map;a.forEach(u=>{var m,v,w,C,T,P;const p=(m=u.roleDefinition)==null?void 0:m.id;if(!p)return;n.has(p)||n.set(p,{roleId:p,roleName:((v=u.roleDefinition)==null?void 0:v.displayName)||"Unknown",groupCount:0,userCount:0,isCovered:!1});const h=n.get(p);(C=(w=u.principal)==null?void 0:w["@odata.type"])!=null&&C.includes("group")?(h.groupCount++,h.isCovered=!0):(P=(T=u.principal)==null?void 0:T["@odata.type"])!=null&&P.includes("user")&&h.userCount++});const c=Array.from(n.values()),l=c.filter(u=>u.isCovered),d=c.filter(u=>!u.isCovered);return{success:!0,totalRoles:c.length,coveredRoles:l.length,uncoveredRoles:d.length,totalPIMGroups:t.length,groupAssignmentsCount:r.length,directUserAssignmentsCount:s.length,roles:c}}catch(e){return console.error("Failed to generate coverage report:",e),{success:!1,error:this.getFriendlyError(e)}}}async runHealthCheck(){try{const e=[],t=[],i=await this.getRoleAssignmentsWithExpiration();i.expiringCount>0&&t.push({severity:"warning",category:"Expiring Assignments",message:`${i.expiringCount} role assignments expiring within 7 days`,count:i.expiringCount});const a=await this.getRoleCoverageReport();a.success&&a.directUserAssignmentsCount>0&&t.push({severity:"info",category:"Direct Assignments",message:`${a.directUserAssignmentsCount} direct user assignments found (consider using groups)`,count:a.directUserAssignmentsCount});const s=((await this.getPIMGroups()).groups||[]).filter(l=>l.memberCount===0);s.length>0&&t.push({severity:"info",category:"Empty Groups",message:`${s.length} PIM groups have no members`,count:s.length,groups:s.map(l=>l.displayName)});const n=await this.getPendingApprovals();n.count>0&&t.push({severity:"warning",category:"Pending Approvals",message:`${n.count} approval requests awaiting review`,count:n.count});const c=Math.max(0,100-e.length*20-t.length*5);return{success:!0,healthScore:c,status:c>=80?"healthy":c>=60?"warning":"critical",issues:e,warnings:t,checksRun:4,timestamp:new Date().toISOString()}}catch(e){return console.error("Health check failed:",e),{success:!1,error:this.getFriendlyError(e)}}}async getMyEligibleRoles(){try{return{success:!0,roles:((await this.get(`${this.betaUrl}/roleManagement/directory/roleEligibilityScheduleInstances?$filter=principalId eq '${await this.getCurrentUserId()}'&$expand=roleDefinition`)).value||[]).map(i=>{var a,r,s;return{id:i.id,roleId:i.roleDefinitionId,displayName:((a=i.roleDefinition)==null?void 0:a.displayName)||"Unknown Role",description:((r=i.roleDefinition)==null?void 0:r.description)||"",privilegeLevel:this.determinePrivilegeLevel((s=i.roleDefinition)==null?void 0:s.displayName),assignmentEnd:i.endDateTime,requiresApproval:!1,requiresMfa:!1,requiresJustification:!0,requiresTicket:!1,maxDuration:8,defaultDuration:4}})}}catch(e){return console.error("Failed to get eligible roles:",e),{success:!1,error:this.getFriendlyError(e),roles:[]}}}async getMyActiveRoles(){try{return{success:!0,roles:((await this.get(`${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleInstances?$filter=principalId eq '${await this.getCurrentUserId()}' and assignmentType eq 'Activated'&$expand=roleDefinition`)).value||[]).map(i=>{var a,r,s,n;return{id:i.id,roleId:i.roleDefinitionId,displayName:((a=i.roleDefinition)==null?void 0:a.displayName)||"Unknown Role",description:((r=i.roleDefinition)==null?void 0:r.description)||"",privilegeLevel:this.determinePrivilegeLevel((s=i.roleDefinition)==null?void 0:s.displayName),startDateTime:i.startDateTime,endDateTime:i.endDateTime,justification:i.justification,ticketNumber:(n=i.ticketInfo)==null?void 0:n.ticketNumber,canExtend:!1}})}}catch(e){return console.error("Failed to get active roles:",e),{success:!1,error:this.getFriendlyError(e),roles:[]}}}async getRoleAssignmentDetails(e){var t,i,a,r;try{try{const n=(await this.get(`${this.betaUrl}/policies/roleManagementPolicies?$filter=scopeId eq '/' and scopeType eq 'DirectoryRole'&$expand=rules`)).value.find(c=>{var l;return(l=c.rules)==null?void 0:l.some(d=>{var u,p;return(p=(u=d.target)==null?void 0:u.targetObjects)==null?void 0:p.some(h=>h===e)})});if(n){const c=n.rules||[],l=c.find(h=>{var m,v,w;return h["@odata.type"]==="#microsoft.graph.unifiedRoleManagementPolicyEnablementRule"&&((m=h.target)==null?void 0:m.caller)==="EndUser"&&((w=(v=h.target)==null?void 0:v.operations)==null?void 0:w.includes("All"))}),d=c.find(h=>{var m;return h["@odata.type"]==="#microsoft.graph.unifiedRoleManagementPolicyApprovalRule"&&((m=h.target)==null?void 0:m.caller)==="EndUser"}),u=c.find(h=>{var m,v,w;return h["@odata.type"]==="#microsoft.graph.unifiedRoleManagementPolicyExpirationRule"&&((m=h.target)==null?void 0:m.caller)==="EndUser"&&((w=(v=h.target)==null?void 0:v.operations)==null?void 0:w.includes("All"))}),p=(l==null?void 0:l.enabledRules)||[];return{success:!0,requiresMFA:p.includes("MultiFactorAuthentication"),requiresApproval:((t=d==null?void 0:d.setting)==null?void 0:t.isApprovalRequired)||!1,requiresJustification:p.includes("Justification"),requiresTicket:p.includes("Ticketing"),maxDuration:this.parseIsoDuration(u==null?void 0:u.maximumDuration)||8,defaultDuration:4,approvers:((r=(a=(i=d==null?void 0:d.setting)==null?void 0:i.approvalStages)==null?void 0:a[0])==null?void 0:r.primaryApprovers)||[]}}}catch(s){console.warn("Could not fetch policy, using defaults:",s.message)}return{success:!0,requiresMFA:!1,requiresApproval:!1,requiresJustification:!0,requiresTicket:!1,maxDuration:8,defaultDuration:4,approvers:[]}}catch(s){return console.error("Failed to get role details:",s),{success:!1,error:this.getFriendlyError(s)}}}async activateRole(e){try{const i={principalId:await this.getCurrentUserId(),roleDefinitionId:e.roleId,directoryScopeId:"/",action:"selfActivate",justification:e.justification||"Role activation",scheduleInfo:{startDateTime:new Date().toISOString(),expiration:{type:"afterDuration",duration:`PT${e.duration}H`}}};return e.ticketNumber&&(i.ticketInfo={ticketNumber:e.ticketNumber,ticketSystem:"Manual"}),await this.post(`${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,i),{success:!0,requiresApproval:!1}}catch(t){return console.error("Failed to activate role:",t),{success:!1,error:this.getFriendlyError(t)}}}async deactivateRole(e){try{const t=await this.getCurrentUserId(),i=await this.get(`${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleInstances/${e}`),a={principalId:t,roleDefinitionId:i.roleDefinitionId,directoryScopeId:"/",action:"selfDeactivate",justification:"Manual deactivation"};return await this.post(`${this.betaUrl}/roleManagement/directory/roleAssignmentScheduleRequests`,a),{success:!0}}catch(t){return console.error("Failed to deactivate role:",t),{success:!1,error:this.getFriendlyError(t)}}}async getCurrentUserId(){try{return(await this.get(`${this.baseUrl}/me?$select=id`)).id}catch(e){throw console.error("Failed to get current user ID:",e),e}}determinePrivilegeLevel(e){const t=(e||"").toLowerCase();return t.includes("global admin")||t.includes("company admin")?"critical":t.includes("privileged")||t.includes("security")||t.includes("compliance")?"high":t.includes("admin")||t.includes("director")?"medium":"low"}getFriendlyError(e){const t=e.message||e.toString();return e.status===401?"Session expired. Please sign in again.":e.status===403?"You do not have permission to perform this action.":e.status===404?"Resource not found.":e.code==="Authorization_RequestDenied"?"Access denied. Admin consent may be required.":t}};ea(Le,"PRIVILEGE_LEVELS",{critical:["62e90394-69f5-4237-9190-012177145e10","e8611ab8-c189-46e8-94e1-60213ab1f814","194ae4cb-b126-40b2-bd5b-6091b380977d","9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3","158c047a-c907-4556-b7ef-446551a6b5f7","29232cdf-9323-42fd-ade2-1d097af3e4de","f28a1f50-f6e7-4571-818b-6a12f2af6b6c","fe930be7-5e62-47db-91af-98c3a49a38b1"],high:["7be44c8a-adaf-4e2a-84d6-ab2649e08a13","c4e39bd9-1100-46d3-8c65-fb160da0071f","b1be1c3e-b65d-4f19-8427-f6fa0d97feb9","729827e3-9c14-49f7-bb1b-9608f156bbb8","b0f54661-2d74-4c50-afa3-1ec803f12efe","966707d0-3269-4727-9be2-8c3a10f19b9d","fdd7a751-b60b-444a-984c-02652fe8fa1c","3a2c62db-5318-420d-8d74-23affee5d9d5","11648597-926c-4cf3-9c36-bcebb0ba8dcc"],medium:["44367163-eba1-44c3-98af-f5787879f96a","3d762c5a-1b6c-493f-843e-55a3b42923d4","112f9467-49fe-4fc5-9abe-d52302e4f8c1","31392ffb-586c-42d1-9346-e59415a2cc4e","892c5842-a9a6-463a-8041-72aa08ca3cf6","17315797-102d-40b4-93e0-432062caca18","d29b2b05-8046-44ba-8758-1e26182fcf32"]});let ci=Le;const E=new ci,$a={standard:{id:"standard",name:"Standard Security",description:"Balanced security for typical enterprise use. Requires MFA and justification, with 8-hour activation window.",icon:"fa-shield-alt",color:"primary",settings:{activation:{maximumDurationHours:8,requireMfa:!0,requireJustification:!0,requireTicketInfo:!1,requireApproval:!1},eligibleAssignment:{allowPermanent:!0,maximumDurationDays:365},activeAssignment:{allowPermanent:!1,maximumDurationDays:30,requireMfa:!0,requireJustification:!0}}},"high-security":{id:"high-security",name:"High Security",description:"Maximum security with mandatory approval workflows. Short activation window with all security controls enabled.",icon:"fa-lock",color:"danger",settings:{activation:{maximumDurationHours:4,requireMfa:!0,requireJustification:!0,requireTicketInfo:!0,requireApproval:!0},eligibleAssignment:{allowPermanent:!1,maximumDurationDays:180},activeAssignment:{allowPermanent:!1,maximumDurationDays:7,requireMfa:!0,requireJustification:!0}}},"low-friction":{id:"low-friction",name:"Low Friction",description:"Streamlined access for trusted environments. Extended activation window with minimal approval barriers.",icon:"fa-bolt",color:"warning",settings:{activation:{maximumDurationHours:12,requireMfa:!0,requireJustification:!1,requireTicketInfo:!1,requireApproval:!1},eligibleAssignment:{allowPermanent:!0,maximumDurationDays:365},activeAssignment:{allowPermanent:!1,maximumDurationDays:90,requireMfa:!1,requireJustification:!1}}},compliance:{id:"compliance",name:"Compliance Ready",description:"Settings aligned with SOX, HIPAA, and other regulatory requirements. Full audit trail with ticket tracking.",icon:"fa-clipboard-check",color:"success",settings:{activation:{maximumDurationHours:8,requireMfa:!0,requireJustification:!0,requireTicketInfo:!0,requireApproval:!0},eligibleAssignment:{allowPermanent:!1,maximumDurationDays:90},activeAssignment:{allowPermanent:!1,maximumDurationDays:14,requireMfa:!0,requireJustification:!0}}}},Da="pimbuddy-custom-templates";class dl{constructor(){this.customTemplates=this.loadCustomTemplates()}getAllTemplates(){return{...$a,...this.customTemplates}}getBuiltInTemplates(){return{...$a}}getCustomTemplates(){return{...this.customTemplates}}getTemplate(e){return this.getAllTemplates()[e]||null}getTemplateSettings(e){const t=this.getTemplate(e);return t?t.settings:null}saveCustomTemplate(e){if(!e.id||!e.name||!e.settings)throw new Error("Template must have id, name, and settings");return e.isCustom=!0,e.createdAt=e.createdAt||new Date().toISOString(),e.updatedAt=new Date().toISOString(),this.customTemplates[e.id]=e,this.persistCustomTemplates(),e}deleteCustomTemplate(e){return this.customTemplates[e]?(delete this.customTemplates[e],this.persistCustomTemplates(),!0):!1}createTemplateFromSettings(e,t,i){const a="custom-"+Date.now();return this.saveCustomTemplate({id:a,name:e,description:t,icon:"fa-file-alt",color:"secondary",isCustom:!0,settings:i})}compareSettings(e,t){const i=[];return e.activation.maximumDurationHours!==t.activation.maximumDurationHours&&i.push({setting:"Maximum Activation Duration",current:`${e.activation.maximumDurationHours} hours`,template:`${t.activation.maximumDurationHours} hours`}),e.activation.requireMfa!==t.activation.requireMfa&&i.push({setting:"Require MFA",current:e.activation.requireMfa?"Yes":"No",template:t.activation.requireMfa?"Yes":"No"}),e.activation.requireJustification!==t.activation.requireJustification&&i.push({setting:"Require Justification",current:e.activation.requireJustification?"Yes":"No",template:t.activation.requireJustification?"Yes":"No"}),e.activation.requireApproval!==t.activation.requireApproval&&i.push({setting:"Require Approval",current:e.activation.requireApproval?"Yes":"No",template:t.activation.requireApproval?"Yes":"No"}),e.activation.requireTicketInfo!==t.activation.requireTicketInfo&&i.push({setting:"Require Ticket Info",current:e.activation.requireTicketInfo?"Yes":"No",template:t.activation.requireTicketInfo?"Yes":"No"}),i}loadCustomTemplates(){try{const e=localStorage.getItem(Da);return e?JSON.parse(e):{}}catch{return{}}}persistCustomTemplates(){localStorage.setItem(Da,JSON.stringify(this.customTemplates))}}const Xe=new dl;class ul{constructor(){this.diagramTypes={"user-group":{name:"Users → Groups",description:"Shows which users are eligible/active members of PIM groups",icon:"fa-users"},"group-role":{name:"Groups → Roles",description:"Shows which groups have assignments to Entra ID roles",icon:"fa-sitemap"},"full-hierarchy":{name:"Full Hierarchy",description:"Complete view: Users → Groups → Roles",icon:"fa-project-diagram"},"role-assignments":{name:"Role Assignments",description:"Shows all role assignments (direct and through groups)",icon:"fa-user-shield"}}}generateDiagram(e,t,i={}){switch(e){case"user-group":return this.generateUserGroupDiagram(t,i);case"group-role":return this.generateGroupRoleDiagram(t,i);case"full-hierarchy":return this.generateFullHierarchyDiagram(t,i);case"role-assignments":return this.generateRoleAssignmentsDiagram(t,i);default:return this.generateFullHierarchyDiagram(t,i)}}generateUserGroupDiagram(e,t={}){const{groups:i=[],groupAssignments:a={}}=e,{showEligible:r=!0,showActive:s=!0,direction:n="LR"}=t;let c=`flowchart ${n}
`;c+=`    %% PIMMaid - Users to Groups Diagram
`,c+=`    %% Generated: ${new Date().toISOString()}

`,c+=`    subgraph Users["👤 Users"]
`;const l=new Map,d=[];for(const[u,p]of Object.entries(a))if(i.find(m=>m.id===u)){if(r&&p.eligible)for(const m of p.eligible)l.has(m.id)||l.set(m.id,{...m,type:"user"}),d.push({from:m.id,to:u,type:"eligible",label:"eligible"});if(s&&p.active)for(const m of p.active)l.has(m.id)||l.set(m.id,{...m,type:"user"}),d.push({from:m.id,to:u,type:"active",label:"active"})}for(const[u,p]of l){const h=this.sanitizeId(p.displayName||u);c+=`        ${this.sanitizeId(u)}["${h}"]
`}c+=`    end

`,c+=`    subgraph Groups["🔐 PIM Groups"]
`;for(const u of i)if(a[u.id]){const p=this.sanitizeId(u.displayName);c+=`        ${this.sanitizeId(u.id)}[["${p}"]]
`}c+=`    end

`,c+=`    %% Connections
`;for(const u of d){const p=u.type==="eligible"?"-.->":"-->",h=u.type==="eligible"?"|eligible|":"|active|";c+=`    ${this.sanitizeId(u.from)} ${p}${h} ${this.sanitizeId(u.to)}
`}return c+=this.getDefaultStyles(),c}generateGroupRoleDiagram(e,t={}){const{groups:i=[],roles:a=[],roleAssignments:r={}}=e,{direction:s="LR"}=t;let n=`flowchart ${s}
`;n+=`    %% PIMMaid - Groups to Roles Diagram
`,n+=`    %% Generated: ${new Date().toISOString()}

`,n+=`    subgraph Groups["🔐 PIM Groups"]
`;const c=new Set;for(const[d,u]of Object.entries(r))for(const p of u)p.principalType==="Group"&&c.add(p.principalId);for(const d of i)c.has(d.id)&&(n+=`        ${this.sanitizeId(d.id)}[["${this.sanitizeId(d.displayName)}"]]
`);n+=`    end

`,n+=`    subgraph Roles["🛡️ Entra ID Roles"]
`;const l=new Set(Object.keys(r));for(const d of a)if(l.has(d.id)){const u=this.getPrivilegeIcon(d.privilegeLevel);n+=`        ${this.sanitizeId(d.id)}[/"${u} ${this.sanitizeId(d.displayName)}"\\]
`}n+=`    end

`,n+=`    %% Assignments
`;for(const[d,u]of Object.entries(r))for(const p of u)if(p.principalType==="Group"){const h=p.assignmentType==="Eligible"?"-.->":"-->",m=p.assignmentType==="Eligible"?"|eligible|":"|active|";n+=`    ${this.sanitizeId(p.principalId)} ${h}${m} ${this.sanitizeId(d)}
`}return n+=this.getDefaultStyles(),n}generateFullHierarchyDiagram(e,t={}){var w;const{groups:i=[],roles:a=[],groupAssignments:r={},roleAssignments:s={}}=e,{direction:n="LR",showEligible:c=!0,showActive:l=!0}=t;let d=`flowchart ${n}
`;d+=`    %% PIMMaid - Full PIM Hierarchy
`,d+=`    %% Generated: ${new Date().toISOString()}

`;const u=new Map,p=[],h=[];for(const[C,T]of Object.entries(r)){if(c&&T.eligible)for(const P of T.eligible)u.set(P.id,P),p.push({userId:P.id,groupId:C,type:"eligible"});if(l&&T.active)for(const P of T.active)u.set(P.id,P),p.push({userId:P.id,groupId:C,type:"active"})}for(const[C,T]of Object.entries(s))for(const P of T)P.principalType==="Group"&&h.push({groupId:P.principalId,roleId:C,type:((w=P.assignmentType)==null?void 0:w.toLowerCase())||"active"});if(u.size>0){d+=`    subgraph Users["👤 Users"]
`,d+=`        direction TB
`;for(const[C,T]of u)d+=`        ${this.sanitizeId(C)}["${this.sanitizeId(T.displayName||"Unknown")}"]
`;d+=`    end

`}const m=new Set([...p.map(C=>C.groupId),...h.map(C=>C.groupId)]);if(m.size>0){d+=`    subgraph Groups["🔐 PIM Groups"]
`,d+=`        direction TB
`;for(const C of i)m.has(C.id)&&(d+=`        ${this.sanitizeId(C.id)}[["${this.sanitizeId(C.displayName)}"]]
`);d+=`    end

`}const v=new Set(h.map(C=>C.roleId));if(v.size>0){d+=`    subgraph Roles["🛡️ Entra Roles"]
`,d+=`        direction TB
`;for(const C of a)if(v.has(C.id)){const T=this.getPrivilegeIcon(C.privilegeLevel);d+=`        ${this.sanitizeId(C.id)}[/"${T} ${this.sanitizeId(C.displayName)}"\\]
`}d+=`    end

`}d+=`    %% User to Group assignments
`;for(const C of p){const T=C.type==="eligible"?"-.->":"-->";d+=`    ${this.sanitizeId(C.userId)} ${T} ${this.sanitizeId(C.groupId)}
`}d+=`
    %% Group to Role assignments
`;for(const C of h){const T=C.type==="eligible"?"-.->":"-->";d+=`    ${this.sanitizeId(C.groupId)} ${T} ${this.sanitizeId(C.roleId)}
`}return d+=this.getDefaultStyles(),d}generateRoleAssignmentsDiagram(e,t={}){const{roles:i=[],roleAssignments:a={}}=e,{direction:r="TB"}=t;let s=`flowchart ${r}
`;s+=`    %% PIMMaid - Role Assignments Overview
`,s+=`    %% Generated: ${new Date().toISOString()}

`;const n=i.filter(h=>h.privilegeLevel==="critical"),c=i.filter(h=>h.privilegeLevel==="high"),l=i.filter(h=>h.privilegeLevel==="medium"),d=i.filter(h=>h.privilegeLevel==="low"),u=(h,m,v)=>{if(h.length===0)return"";let w=`    subgraph ${m.replace(/\s/g,"")}["${v} ${m}"]
`;for(const C of h)a[C.id]&&(w+=`        ${this.sanitizeId(C.id)}[/"${this.sanitizeId(C.displayName)}"\\]
`);return w+=`    end

`,w};s+=u(n,"Critical Roles","💀"),s+=u(c,"High Privilege","⚠️"),s+=u(l,"Medium Privilege","🔵"),s+=u(d,"Low Privilege","✅");const p=new Map;for(const[h,m]of Object.entries(a))for(const v of m)p.has(v.principalId)||p.set(v.principalId,{id:v.principalId,name:v.principalDisplayName||"Unknown",type:v.principalType});if(p.size>0){s+=`    subgraph Principals["👥 Assigned Principals"]
`;for(const[h,m]of p){const v=m.type==="Group"?`[["${this.sanitizeId(m.name)}"]]`:`["${this.sanitizeId(m.name)}"]`;s+=`        ${this.sanitizeId(h)}${v}
`}s+=`    end

`}s+=`    %% Assignments
`;for(const[h,m]of Object.entries(a))for(const v of m){const w=v.assignmentType==="Eligible"?"-.->":"-->";s+=`    ${this.sanitizeId(v.principalId)} ${w} ${this.sanitizeId(h)}
`}return s+=this.getDefaultStyles(),s}getPrivilegeIcon(e){return{critical:"💀",high:"⚠️",medium:"🔵",low:"✅"}[e]||"📋"}sanitizeId(e){return e?e.replace(/[^a-zA-Z0-9\s-]/g,"").replace(/\s+/g,"_").substring(0,40):"unknown"}getDefaultStyles(){return`
    %% Styling
    classDef userNode fill:#1e3a5f,stroke:#00d4aa,stroke-width:2px,color:#fff
    classDef groupNode fill:#2d1b4e,stroke:#7c3aed,stroke-width:2px,color:#fff
    classDef criticalRole fill:#4a1515,stroke:#ef4444,stroke-width:3px,color:#fff
    classDef highRole fill:#4a3415,stroke:#f59e0b,stroke-width:2px,color:#fff
    classDef mediumRole fill:#1e3a5f,stroke:#3b82f6,stroke-width:2px,color:#fff
    classDef lowRole fill:#1a3a2a,stroke:#10b981,stroke-width:2px,color:#fff
`}getDiagramTypes(){return this.diagramTypes}getStats(e){const{groups:t=[],roles:i=[],groupAssignments:a={},roleAssignments:r={}}=e;let s=new Set,n=0,c=0;for(const d of Object.values(a))d.eligible&&(d.eligible.forEach(u=>s.add(u.id)),n+=d.eligible.length),d.active&&(d.active.forEach(u=>s.add(u.id)),c+=d.active.length);const l={critical:i.filter(d=>d.privilegeLevel==="critical").length,high:i.filter(d=>d.privilegeLevel==="high").length,medium:i.filter(d=>d.privilegeLevel==="medium").length,low:i.filter(d=>d.privilegeLevel==="low").length};return{totalUsers:s.size,totalGroups:t.length,totalRoles:i.length,eligibleAssignments:n,activeAssignments:c,rolesByPrivilege:l}}}const Gt=new ul;class hl{constructor(){this.baselineConfigurations={"enterprise-standard":{id:"enterprise-standard",name:"Enterprise Standard",description:"Balanced security for typical enterprise environments. Implements tiered access with MFA and approval workflows for critical roles.",icon:"fa-building",color:"primary",features:["Tiered access model (T0/T1/T2)","MFA required for all roles","Approval required for Tier 0","Justification tracking","4-8 hour activation windows"],tiers:[{tier:0,name:"Tier 0 - Critical Infrastructure",description:"Highest privilege roles with maximum security controls",policy:{maximumDurationHours:4,requireMfa:!0,requireJustification:!0,requireTicketInfo:!0,requireApproval:!0},groups:[{name:"PIM-T0-Global-Administrators",description:"Tier 0: Global Administrator role access",roles:["62e90394-69f5-4237-9190-012177145e10"]},{name:"PIM-T0-Privileged-Role-Administrators",description:"Tier 0: Privileged Role Administrator access",roles:["e8611ab8-c189-46e8-94e1-60213ab1f814"]},{name:"PIM-T0-Security-Administrators",description:"Tier 0: Security Administrator access",roles:["194ae4cb-b126-40b2-bd5b-6091b380977d"]}]},{tier:1,name:"Tier 1 - High Privilege Operations",description:"High privilege operational roles",policy:{maximumDurationHours:8,requireMfa:!0,requireJustification:!0,requireTicketInfo:!1,requireApproval:!1},groups:[{name:"PIM-T1-User-Administrators",description:"Tier 1: User Administrator access",roles:["fe930be7-5e62-47db-91af-98c3a49a38b1"]},{name:"PIM-T1-Exchange-Administrators",description:"Tier 1: Exchange Administrator access",roles:["29232cdf-9323-42fd-ade2-1d097af3e4de"]},{name:"PIM-T1-SharePoint-Administrators",description:"Tier 1: SharePoint Administrator access",roles:["f28a1f50-f6e7-4571-818b-6a12f2af6b6c"]},{name:"PIM-T1-Application-Administrators",description:"Tier 1: Application Administrator access",roles:["9b895d92-2cd3-44c7-9d02-a6ac2d5ea5c3"]}]},{tier:2,name:"Tier 2 - Standard Operations",description:"Standard operational roles with moderate privilege",policy:{maximumDurationHours:8,requireMfa:!0,requireJustification:!0,requireTicketInfo:!1,requireApproval:!1},groups:[{name:"PIM-T2-Helpdesk-Administrators",description:"Tier 2: Helpdesk Administrator access",roles:["729827e3-9c14-49f7-bb1b-9608f156bbb8"]},{name:"PIM-T2-Groups-Administrators",description:"Tier 2: Groups Administrator access",roles:["fdd7a751-b60b-444a-984c-02652fe8fa1c"]},{name:"PIM-T2-Teams-Administrators",description:"Tier 2: Teams Administrator access",roles:["69091246-20e8-4a56-aa4d-066075b2a7a8"]}]}]},"high-security":{id:"high-security",name:"High Security (Zero Trust)",description:"Maximum security baseline for highly regulated industries. All roles require approval, short activation windows, and comprehensive audit trails.",icon:"fa-shield-alt",color:"danger",features:["Zero Trust security model","Approval required for all tiers","Ticket tracking mandatory","Short activation (2-6 hours)","Comprehensive audit trails","MFA + Justification always required"],tiers:[{tier:0,name:"Tier 0 - Critical Infrastructure",description:"Maximum security for critical roles",policy:{maximumDurationHours:2,requireMfa:!0,requireJustification:!0,requireTicketInfo:!0,requireApproval:!0},groups:[{name:"PIM-ZT-T0-Global-Administrators",description:"Zero Trust Tier 0: Global Administrator (2h max, full approval)",roles:["62e90394-69f5-4237-9190-012177145e10"]},{name:"PIM-ZT-T0-Privileged-Role-Administrators",description:"Zero Trust Tier 0: Privileged Role Administrator",roles:["e8611ab8-c189-46e8-94e1-60213ab1f814"]},{name:"PIM-ZT-T0-Security-Administrators",description:"Zero Trust Tier 0: Security Administrator",roles:["194ae4cb-b126-40b2-bd5b-6091b380977d"]}]},{tier:1,name:"Tier 1 - High Privilege Operations",description:"Strict controls for operational roles",policy:{maximumDurationHours:4,requireMfa:!0,requireJustification:!0,requireTicketInfo:!0,requireApproval:!0},groups:[{name:"PIM-ZT-T1-User-Administrators",description:"Zero Trust Tier 1: User Administrator",roles:["fe930be7-5e62-47db-91af-98c3a49a38b1"]},{name:"PIM-ZT-T1-Exchange-Administrators",description:"Zero Trust Tier 1: Exchange Administrator",roles:["29232cdf-9323-42fd-ade2-1d097af3e4de"]},{name:"PIM-ZT-T1-SharePoint-Administrators",description:"Zero Trust Tier 1: SharePoint Administrator",roles:["f28a1f50-f6e7-4571-818b-6a12f2af6b6c"]}]},{tier:2,name:"Tier 2 - Standard Operations",description:"Enhanced security for standard roles",policy:{maximumDurationHours:6,requireMfa:!0,requireJustification:!0,requireTicketInfo:!0,requireApproval:!1},groups:[{name:"PIM-ZT-T2-Helpdesk-Administrators",description:"Zero Trust Tier 2: Helpdesk Administrator",roles:["729827e3-9c14-49f7-bb1b-9608f156bbb8"]},{name:"PIM-ZT-T2-Groups-Administrators",description:"Zero Trust Tier 2: Groups Administrator",roles:["fdd7a751-b60b-444a-984c-02652fe8fa1c"]}]}]},"quick-start":{id:"quick-start",name:"Quick Start (Development/POC)",description:"Simplified configuration for development environments and proof of concepts. Lower friction with basic security controls.",icon:"fa-rocket",color:"success",features:["Simplified 2-tier model","MFA required only","No approval workflows","Extended activation (8-12 hours)","Ideal for dev/test environments"],tiers:[{tier:0,name:"Critical Roles",description:"Essential admin roles with basic PIM",policy:{maximumDurationHours:8,requireMfa:!0,requireJustification:!1,requireTicketInfo:!1,requireApproval:!1},groups:[{name:"PIM-Global-Administrators",description:"Global Administrator access",roles:["62e90394-69f5-4237-9190-012177145e10"]},{name:"PIM-User-Administrators",description:"User Administrator access",roles:["fe930be7-5e62-47db-91af-98c3a49a38b1"]}]},{tier:1,name:"Operational Roles",description:"Common operational roles",policy:{maximumDurationHours:12,requireMfa:!0,requireJustification:!1,requireTicketInfo:!1,requireApproval:!1},groups:[{name:"PIM-Helpdesk-Administrators",description:"Helpdesk Administrator access",roles:["729827e3-9c14-49f7-bb1b-9608f156bbb8"]},{name:"PIM-Teams-Administrators",description:"Teams Administrator access",roles:["69091246-20e8-4a56-aa4d-066075b2a7a8"]}]}]}},this.bestPractices={naming:{title:"Naming Convention",description:"Groups follow the pattern: PIM-[Tier]-[RoleName]. This makes it easy to identify privilege level at a glance.",example:"PIM-T0-Global-Administrators"},tiering:{title:"Tiered Access Model",description:"Tier 0 = Critical infrastructure, Tier 1 = High privilege operations, Tier 2 = Standard operations. Each tier has appropriate security controls.",reference:"Microsoft Privileged Access Strategy"},policies:{title:"Security Controls by Tier",tier0:"Shortest activation (2-4h), always MFA+Approval+Justification+Ticketing",tier1:"Medium activation (4-8h), MFA+Justification, optional approval",tier2:"Standard activation (6-12h), MFA+Justification"},assignments:{title:"Assignment Strategy",description:"Use eligible assignments (not active). Set time-bound eligibility (90-180 days) and require periodic revalidation.",recommendation:"Never use permanent active assignments for privileged roles"}}}getBaselineConfigurations(){return this.baselineConfigurations}getBaseline(e){return this.baselineConfigurations[e]||null}getBestPractices(){return this.bestPractices}calculateDeploymentPlan(e,t={}){let i,a;if(typeof e=="string"?(i=this.getBaseline(e),a=(i==null?void 0:i.tiers)||[]):(i=this.getBaseline(e.baseline),a=e.tiers||(i==null?void 0:i.tiers)||[]),!i)return null;const{existingGroups:r=[]}=t,s=new Set(r.map(p=>p.displayName)),n=[],c=[],l=[];for(const p of a)for(const h of p.groups)s.has(h.name)||(n.push({displayName:h.name,description:h.description,mailEnabled:!1,mailNickname:h.name.replace(/[^a-zA-Z0-9]/g,"-").toLowerCase(),securityEnabled:!0,isAssignableToRole:!0,roles:h.roles,tier:p.tier,policy:p.policy}),c.push({groupName:h.name,policy:p.policy}),l.push(...h.roles.map(m=>({groupName:h.name,roleId:m}))));const d=n.length*15+c.length*10+l.length*5,u=Math.ceil(d/60);return{baseline:i.name,groupsToCreate:n,policiesToConfigure:c,roleAssignmentsToCreate:l,estimatedTime:u>1?`${u} minutes`:"< 1 minute",steps:this.getDeploymentStepsList(n.length,c.length)}}getDeploymentStepsList(e,t){return[{icon:"fa-users",title:"Create PIM Groups",description:`Create ${e} role-assignable security groups with appropriate naming`},{icon:"fa-clock",title:"Wait for Provisioning",description:"Allow time for groups to be fully provisioned in Azure AD"},{icon:"fa-shield-alt",title:"Configure Policies",description:`Apply ${t} tier-specific policies (expiration, enablement, approval)`},{icon:"fa-check-circle",title:"Verify Deployment",description:"Confirm all groups and policies are correctly configured"}]}estimateDeploymentTime(e,t,i){const a=e*15+t*10+i*5;return Math.ceil(a/60)}getDeploymentSteps(e,t={}){const i=this.getBaseline(e);if(!i)return[];const a=[],{selectedTiers:r=null}=t;let s=i.tiers;r&&(s=s.filter(n=>r.includes(n.tier)));for(const n of s)for(const c of n.groups)a.push({type:"create-group",tier:n.tier,tierName:n.name,group:c,description:`Create group: ${c.name}`});for(const n of s)for(const c of n.groups)a.push({type:"apply-policy",tier:n.tier,tierName:n.name,group:c,policy:n.policy,description:`Configure policy for: ${c.name}`});if(t.userAssignments){for(const n of s)for(const c of n.groups)if(t.userAssignments[c.name])for(const l of t.userAssignments[c.name])a.push({type:"assign-user",tier:n.tier,tierName:n.name,group:c,userId:l,description:`Assign user to: ${c.name}`})}return a}validateBaseline(e,t={}){let i,a;if(typeof e=="string"?(i=this.getBaseline(e),a=(i==null?void 0:i.tiers)||[]):(i=this.getBaseline(e.baseline),a=e.tiers||(i==null?void 0:i.tiers)||[]),!i)return{valid:!1,errors:["Baseline not found"],warnings:[]};const{existingGroups:r=[]}=t,s=[],n=[],c=new Set(r.map(p=>p.displayName));let l=0;const d=[],u=[];for(const p of a)for(const h of p.groups)c.has(h.name)?(d.push(h.name),n.push(`Group "${h.name}" already exists and will be skipped`)):(l++,u.push(h.name));return l===0&&d.length>0&&(n.push(`All ${d.length} groups already exist. Nothing to deploy.`),n.push("Tip: Customize group names or delete existing groups first.")),{valid:l>0,errors:s,warnings:n,groupsToCreate:l,existingGroups:d,newGroups:u}}getBaselineSummary(e){const t=this.getBaseline(e);if(!t)return null;const i={name:t.name,description:t.description,tiers:t.tiers.length,totalGroups:0,totalRoles:0,policies:{},securityLevel:this.calculateSecurityLevel(t)};for(const a of t.tiers){i.totalGroups+=a.groups.length,i.totalRoles+=a.groups.reduce((s,n)=>s+n.roles.length,0);const r=JSON.stringify(a.policy);i.policies[r]||(i.policies[r]={...a.policy,count:0}),i.policies[r].count+=a.groups.length}return i}calculateSecurityLevel(e){let t=0,i=0;for(const a of e.tiers)for(const r of a.groups){i++;const s=a.policy;s.requireMfa&&(t+=20),s.requireJustification&&(t+=15),s.requireApproval&&(t+=25),s.requireTicketInfo&&(t+=15),s.maximumDurationHours<=4?t+=15:s.maximumDurationHours<=8?t+=10:t+=5}return i>0?Math.round(t/i):0}}const je=new hl,Ze={DEFAULT_PAGE_SIZE:50,PAGE_SIZE_OPTIONS:[20,50,100,200]};class Kt{constructor(e=[],t=Ze.DEFAULT_PAGE_SIZE){this.allItems=e,this.pageSize=t,this.currentPage=1,this.totalPages=Math.ceil(e.length/t)}getCurrentPageItems(){const e=(this.currentPage-1)*this.pageSize,t=e+this.pageSize;return this.allItems.slice(e,t)}goToPage(e){return e<1||e>this.totalPages?!1:(this.currentPage=e,!0)}nextPage(){return this.goToPage(this.currentPage+1)}previousPage(){return this.goToPage(this.currentPage-1)}firstPage(){this.currentPage=1}lastPage(){this.currentPage=this.totalPages}updateItems(e){this.allItems=e,this.totalPages=Math.ceil(e.length/this.pageSize),this.currentPage>this.totalPages&&(this.currentPage=Math.max(1,this.totalPages))}setPageSize(e){this.pageSize=e,this.totalPages=Math.ceil(this.allItems.length/this.pageSize);const t=(this.currentPage-1)*this.pageSize;this.currentPage=Math.floor(t/e)+1}getInfo(){const e=(this.currentPage-1)*this.pageSize+1,t=Math.min(e+this.pageSize-1,this.allItems.length);return{currentPage:this.currentPage,totalPages:this.totalPages,pageSize:this.pageSize,totalItems:this.allItems.length,start:e,end:t,hasNext:this.currentPage<this.totalPages,hasPrevious:this.currentPage>1}}getPageNumbers(e=7){if(this.totalPages<=e)return Array.from({length:this.totalPages},(s,n)=>n+1);const t=Math.floor(e/2);let i=Math.max(1,this.currentPage-t),a=Math.min(this.totalPages,i+e-1);a-i<e-1&&(i=Math.max(1,a-e+1));const r=[];i>1&&(r.push(1),i>2&&r.push("..."));for(let s=i;s<=a;s++)r.push(s);return a<this.totalPages&&(a<this.totalPages-1&&r.push("..."),r.push(this.totalPages)),r}renderControls(e="app.handlePageChange"){const t=this.getInfo();if(t.totalPages<=1)return"";const i=this.getPageNumbers();return`
            <div class="pagination-controls" style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-md); border-top: 1px solid var(--border-subtle); gap: var(--space-md); flex-wrap: wrap;">
                <!-- Page Info -->
                <div style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-mono);">
                    Showing <strong>${t.start}-${t.end}</strong> of <strong>${t.totalItems}</strong> items
                </div>

                <!-- Page Navigation -->
                <div style="display: flex; align-items: center; gap: var(--space-xs);">
                    <!-- First Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(1)"
                        ${t.hasPrevious?"":"disabled"}
                        title="First Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-double-left"></i>
                    </button>

                    <!-- Previous Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(${t.currentPage-1})"
                        ${t.hasPrevious?"":"disabled"}
                        title="Previous Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-left"></i>
                    </button>

                    <!-- Page Numbers -->
                    ${i.map(a=>a==="..."?'<span style="padding: 0 var(--space-xs); color: var(--text-muted);">...</span>':`
                            <button
                                class="btn btn-sm ${a===t.currentPage?"btn-primary":"btn-secondary"}"
                                onclick="${e}(${a})"
                                style="min-width: 36px; padding: var(--space-xs) var(--space-sm); font-family: var(--font-mono); font-size: 0.85rem;">
                                ${a}
                            </button>
                        `).join("")}

                    <!-- Next Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(${t.currentPage+1})"
                        ${t.hasNext?"":"disabled"}
                        title="Next Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-right"></i>
                    </button>

                    <!-- Last Page -->
                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="${e}(${t.totalPages})"
                        ${t.hasNext?"":"disabled"}
                        title="Last Page"
                        style="padding: var(--space-xs) var(--space-sm);">
                        <i class="fas fa-angle-double-right"></i>
                    </button>
                </div>

                <!-- Page Size Selector -->
                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    <label style="font-size: 0.85rem; color: var(--text-secondary); font-family: var(--font-mono);">Items per page:</label>
                    <select
                        class="input input-select"
                        onchange="${e.replace("handlePageChange","handlePageSizeChange")}(parseInt(this.value))"
                        style="padding: var(--space-xs) var(--space-sm); font-size: 0.85rem; min-width: 80px;">
                        ${Ze.PAGE_SIZE_OPTIONS.map(a=>`
                            <option value="${a}" ${a===t.pageSize?"selected":""}>${a}</option>
                        `).join("")}
                    </select>
                </div>
            </div>
        `}}class Ve{static exportToCSV(e,t,i=null){if(!e||e.length===0)throw new Error("No data to export");if(!i){const n=e[0];i=Object.keys(n).map(c=>({key:c,header:this.formatHeader(c)}))}const r=[i.map(n=>this.escapeCSVValue(n.header)).join(",")];for(const n of e){const c=i.map(l=>{const d=this.getNestedValue(n,l.key);return this.escapeCSVValue(this.formatCSVValue(d))});r.push(c.join(","))}const s=r.join(`
`);this.downloadFile(s,`${t}.csv`,"text/csv;charset=utf-8;")}static exportToJSON(e,t,i=!0){if(!e)throw new Error("No data to export");const a=JSON.stringify(e,null,i?2:0);this.downloadFile(a,`${t}.json`,"application/json;charset=utf-8;")}static formatHeader(e){return e.replace(/([A-Z])/g," $1").replace(/^./,t=>t.toUpperCase()).trim()}static getNestedValue(e,t){if(!t)return e;const i=t.split(".");let a=e;for(const r of i){if(a==null)return"";a=a[r]}return a}static formatCSVValue(e){return e==null?"":typeof e=="boolean"?e?"Yes":"No":e instanceof Date?e.toISOString():typeof e=="object"?JSON.stringify(e):String(e)}static escapeCSVValue(e){const t=String(e);return t.includes(",")||t.includes('"')||t.includes(`
`)?`"${t.replace(/"/g,'""')}"`:t}static downloadFile(e,t,i){const a=new Blob([e],{type:i}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=t,s.style.display="none",document.body.appendChild(s),s.click(),setTimeout(()=>{document.body.removeChild(s),URL.revokeObjectURL(r)},100)}static generateFilename(e){const t=new Date().toISOString().replace(/[:.]/g,"-").slice(0,-5);return`${e}_${t}`}}const pl={groups:{columns:[{key:"displayName",header:"Group Name"},{key:"description",header:"Description"},{key:"memberCount",header:"Members"},{key:"ownerCount",header:"Owners"},{key:"createdDateTime",header:"Created Date"},{key:"id",header:"Object ID"}]},roles:{columns:[{key:"displayName",header:"Role Name"},{key:"description",header:"Description"},{key:"privilegeLevel",header:"Privilege Level"},{key:"isBuiltIn",header:"Built-in"},{key:"id",header:"Role ID"}]},activity:{columns:[{key:"activityDateTime",header:"Date/Time"},{key:"activityDisplayName",header:"Activity"},{key:"initiatedBy.user.displayName",header:"Initiated By"},{key:"initiatedBy.user.userPrincipalName",header:"UPN"},{key:"category",header:"Category"},{key:"result",header:"Result"}]},policies:{columns:[{key:"displayName",header:"Policy Name"},{key:"scopeId",header:"Scope ID"},{key:"scopeType",header:"Scope Type"},{key:"isOrganizationDefault",header:"Is Default"}]},approvals:{columns:[{key:"principalDisplayName",header:"User"},{key:"principalUserPrincipalName",header:"UPN"},{key:"roleDisplayName",header:"Role"},{key:"requestedDateTime",header:"Requested"},{key:"justification",header:"Justification"},{key:"status",header:"Status"}]}};class gl{constructor(){this.selectedItems=new Set,this.allItems=[],this.onSelectionChange=null}initialize(e,t=null){this.allItems=e,this.selectedItems.clear(),this.onSelectionChange=t}toggleItem(e){this.selectedItems.has(e)?this.selectedItems.delete(e):this.selectedItems.add(e),this.onSelectionChange&&this.onSelectionChange(this.getSelectedItems())}selectAll(){this.selectedItems.clear(),this.allItems.forEach(e=>{this.selectedItems.add(e.id)}),this.onSelectionChange&&this.onSelectionChange(this.getSelectedItems())}clearSelection(){this.selectedItems.clear(),this.onSelectionChange&&this.onSelectionChange(this.getSelectedItems())}isSelected(e){return this.selectedItems.has(e)}getSelectedIds(){return Array.from(this.selectedItems)}getSelectedItems(){return this.allItems.filter(e=>this.selectedItems.has(e.id))}getSelectionCount(){return this.selectedItems.size}areAllSelected(){return this.selectedItems.size===this.allItems.length&&this.allItems.length>0}areSomeSelected(){return this.selectedItems.size>0&&this.selectedItems.size<this.allItems.length}renderHeaderCheckbox(e="app.bulkOps.toggleAll"){const t=this.areAllSelected();return`
            <input
                type="checkbox"
                class="bulk-checkbox header-checkbox ${this.areSomeSelected()?"indeterminate":""}"
                ${t?"checked":""}
                onchange="${e}(this)"
                title="${t?"Deselect All":"Select All"}"
            >
        `}renderRowCheckbox(e,t="app.bulkOps.toggleItem"){return`
            <input
                type="checkbox"
                class="bulk-checkbox"
                ${this.isSelected(e)?"checked":""}
                onchange="${t}('${e}')"
                data-item-id="${e}"
            >
        `}renderBulkActionsToolbar(e=[]){const t=this.getSelectionCount();return t===0?"":`
            <div class="bulk-actions-toolbar" style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md); background: var(--accent-primary-dim); border: 1px solid var(--accent-primary); border-radius: var(--radius-md); margin-bottom: var(--space-md); animation: slideDown 0.2s ease-out;">
                <div style="display: flex; align-items: center; gap: var(--space-sm); flex: 1;">
                    <div style="width: 32px; height: 32px; background: var(--accent-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-check" style="color: var(--bg-primary); font-size: 0.9rem;"></i>
                    </div>
                    <div>
                        <div style="font-family: var(--font-display); font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">
                            ${t} ${t===1?"item":"items"} selected
                        </div>
                        <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                            Choose an action below
                        </div>
                    </div>
                </div>

                <div style="display: flex; align-items: center; gap: var(--space-sm);">
                    ${e.map(i=>`
                        <button
                            class="btn btn-sm ${i.variant||"btn-secondary"}"
                            onclick="${i.onClick}"
                            ${i.disabled?"disabled":""}
                            title="${i.description||i.label}"
                            style="font-family: var(--font-mono); font-size: 0.75rem;">
                            <i class="fas ${i.icon}"></i> ${i.label}
                        </button>
                    `).join("")}

                    <button
                        class="btn btn-sm btn-secondary"
                        onclick="app.bulkOps.clearSelection()"
                        title="Clear Selection"
                        style="font-family: var(--font-mono); font-size: 0.75rem;">
                        <i class="fas fa-times"></i> Clear
                    </button>
                </div>
            </div>
        `}}async function ml(o,e,t,i){const a={total:o.length,succeeded:0,failed:0,errors:[]};for(let r=0;r<o.length;r++){const s=o[r];try{await e(s),a.succeeded++}catch(n){a.failed++,a.errors.push({item:s,error:n.message})}t&&t({current:r+1,total:o.length,percentage:Math.round((r+1)/o.length*100)}),r<o.length-1&&await new Promise(n=>setTimeout(n,200))}return i&&i(a),a}function La(o){const e=o.percentage||0;return`
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">
                <i class="fas fa-cog fa-spin" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: var(--space-sm);">
                Processing Bulk Operation
            </h2>

            <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-xl);">
                ${o.current} of ${o.total} items processed
            </p>

            <!-- Progress Bar -->
            <div style="width: 100%; height: 8px; background: var(--bg-elevated); border-radius: var(--radius-full); overflow: hidden; margin-bottom: var(--space-sm);">
                <div style="width: ${e}%; height: 100%; background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); transition: width 0.3s ease-out;"></div>
            </div>

            <div style="font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--accent-primary);">
                ${e}%
            </div>

            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: var(--space-lg); font-family: var(--font-mono);">
                Please wait while we process your request...
            </p>
        </div>
    `}function fl(o){const e=o.failed>0;return`
        <div style="text-align: center; padding: var(--space-xl);">
            <div style="width: 100px; height: 100px; margin: 0 auto var(--space-lg); background: ${e?"var(--color-warning-dim)":"var(--color-success-dim)"}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <i class="fas ${e?"fa-exclamation-triangle":"fa-check-circle"}" style="font-size: 3.5rem; color: ${e?"var(--color-warning)":"var(--color-success)"};"></i>
            </div>

            <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: var(--space-md);">
                ${e?"Partially Complete":"Operation Complete"}
            </h2>

            <div class="stats-grid" style="margin-bottom: var(--space-lg);">
                <div class="card stat-card" style="text-align: center;">
                    <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-success);">
                        ${o.succeeded}
                    </div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                        Succeeded
                    </div>
                </div>

                ${e?`
                    <div class="card stat-card" style="text-align: center;">
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; color: var(--color-error);">
                            ${o.failed}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                            Failed
                        </div>
                    </div>
                `:""}
            </div>

            ${e&&o.errors.length>0?`
                <details style="text-align: left; margin-top: var(--space-lg); padding: var(--space-md); background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
                    <summary style="cursor: pointer; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
                        View Errors (${o.errors.length})
                    </summary>
                    <div style="margin-top: var(--space-md); max-height: 200px; overflow-y: auto;">
                        ${o.errors.map(t=>`
                            <div style="padding: var(--space-sm); margin-bottom: var(--space-xs); background: var(--color-error-dim); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm); font-size: 0.85rem; font-family: var(--font-mono);">
                                <strong>${t.item.displayName||t.item.id}:</strong> ${t.error}
                            </div>
                        `).join("")}
                    </div>
                </details>
            `:""}

            <button class="btn btn-primary" onclick="app.closeModal()" style="margin-top: var(--space-xl); font-family: var(--font-mono);">
                <i class="fas fa-check"></i> Done
            </button>
        </div>
    `}class pt{static renderPageHeader(e,t=[]){return`
            <div class="page-header-row">
                <h1 class="page-header">${H.escapeHtml(e)}</h1>
                ${t.length>0?`
                    <div style="display: flex; gap: var(--space-sm);">
                        ${t.map(i=>`
                            <button
                                class="btn ${i.variant||"btn-primary"}"
                                onclick="${i.onClick}"
                                ${i.disabled?"disabled":""}
                                title="${i.description||i.label}">
                                ${i.icon?`<i class="fas ${i.icon}"></i>`:""} ${H.escapeHtml(i.label)}
                            </button>
                        `).join("")}
                    </div>
                `:""}
            </div>
        `}static renderToolbar(e={}){const{searchPlaceholder:t="Search...",searchId:i="search",searchCallback:a=null,actions:r=[],filters:s=[]}=e;return`
            <div class="toolbar">
                ${a?`
                    <input
                        type="text"
                        id="${i}"
                        class="input"
                        placeholder="${t}"
                        oninput="${a}(this.value)">
                `:""}

                ${s.map(n=>`
                    <select
                        id="${n.id}"
                        class="input input-select"
                        onchange="${n.onChange}(this.value)">
                        ${n.options.map(c=>`
                            <option value="${c.value}" ${c.selected?"selected":""}>
                                ${H.escapeHtml(c.label)}
                            </option>
                        `).join("")}
                    </select>
                `).join("")}

                ${r.map(n=>`
                    <button
                        class="btn ${n.variant||"btn-secondary"}"
                        onclick="${n.onClick}"
                        ${n.disabled?"disabled":""}
                        title="${n.description||n.label}">
                        ${n.icon?`<i class="fas ${n.icon}"></i>`:""} ${H.escapeHtml(n.label)}
                    </button>
                `).join("")}
            </div>
        `}static renderBadge(e,t="default"){return`<span class="badge ${t!=="default"?`badge-${t}`:""}">${H.escapeHtml(e)}</span>`}static renderPrivilegeBadge(e){const t={critical:{class:"badge-critical",icon:"fa-skull-crossbones",label:"Critical"},high:{class:"badge-high",icon:"fa-exclamation-triangle",label:"High"},medium:{class:"badge-medium",icon:"fa-shield-alt",label:"Medium"},low:{class:"badge-low",icon:"fa-check-circle",label:"Low"}},i=t[e]||t.low;return`<span class="badge privilege-badge ${i.class}"><i class="fas ${i.icon}"></i> ${i.label}</span>`}static renderIconButton(e,t,i={}){const{title:a="",variant:r="",disabled:s=!1,size:n=""}=i;return`
            <button
                class="icon-btn ${r} ${n}"
                onclick="${t}"
                ${s?"disabled":""}
                title="${a}">
                <i class="fas ${e}"></i>
            </button>
        `}static renderEmptyState(e={}){const{icon:t="fa-inbox",title:i="No Data",message:a="No items found",action:r=null}=e;return`
            <div class="empty-state" style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--bg-elevated); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas ${t}" style="font-size: 3.5rem; color: var(--text-muted); opacity: 0.5;"></i>
                </div>
                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                    ${H.escapeHtml(i)}
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted); margin-bottom: ${r?"var(--space-xl)":"0"};">
                    ${H.escapeHtml(a)}
                </div>
                ${r?`
                    <button class="btn btn-primary" onclick="${r.onClick}">
                        ${r.icon?`<i class="fas ${r.icon}"></i>`:""} ${H.escapeHtml(r.label)}
                    </button>
                `:""}
            </div>
        `}static renderLoadingState(e="Loading..."){return`
            <div class="loading-state" style="text-align: center; padding: var(--space-2xl) var(--space-lg);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; animation: pulse 2s ease-in-out infinite;">
                    <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                </div>
                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary);">
                    ${H.escapeHtml(e)}
                </div>
            </div>
        `}static renderStatCard(e={}){const{icon:t="fa-chart-bar",value:i="0",label:a="Stat",color:r="primary",trend:s=null}=e;return`
            <div class="card stat-card" style="position: relative; overflow: hidden;">
                <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-${r}-dim), transparent); filter: blur(40px);"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="width: 56px; height: 56px; background: var(--accent-${r}-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                        <i class="fas ${t}" style="font-size: 1.5rem; color: var(--accent-${r});"></i>
                    </div>
                    <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                        ${H.escapeHtml(String(i))}
                    </div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">
                        ${H.escapeHtml(a)}
                    </div>
                    ${s?`
                        <div style="margin-top: var(--space-sm); font-size: 0.8rem; color: ${s.direction==="up"?"var(--color-success)":"var(--color-error)"};">
                            <i class="fas fa-arrow-${s.direction}"></i> ${H.escapeHtml(s.value)}
                        </div>
                    `:""}
                </div>
            </div>
        `}static renderModal(e={}){const{title:t="Modal",content:i="",actions:a=[],size:r="md",showClose:s=!0}=e;return`
            <div class="modal-header">
                <h2 class="modal-title">${H.escapeHtml(t)}</h2>
                ${s?`
                    <button class="modal-close" onclick="app.closeModal()" title="Close">
                        <i class="fas fa-times"></i>
                    </button>
                `:""}
            </div>
            <div class="modal-body modal-${r}">
                ${i}
            </div>
            ${a.length>0?`
                <div class="modal-footer">
                    ${a.map(n=>`
                        <button
                            class="btn ${n.variant||"btn-primary"}"
                            onclick="${n.onClick}"
                            ${n.disabled?"disabled":""}>
                            ${n.icon?`<i class="fas ${n.icon}"></i>`:""} ${H.escapeHtml(n.label)}
                        </button>
                    `).join("")}
                </div>
            `:""}
        `}static renderConfirmDialog(e={}){const{title:t="Confirm Action",message:i="Are you sure you want to proceed?",confirmLabel:a="Confirm",cancelLabel:r="Cancel",confirmVariant:s="btn-danger",icon:n="fa-exclamation-triangle",iconColor:c="warning",onConfirm:l="",onCancel:d="app.closeModal()"}=e;return this.renderModal({title:t,content:`
                <div style="text-align: center; padding: var(--space-xl);">
                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--color-${c}-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas ${n}" style="font-size: 2.5rem; color: var(--color-${c});"></i>
                    </div>
                    <p style="font-size: 1.1rem; color: var(--text-primary); line-height: 1.5;">
                        ${H.escapeHtml(i)}
                    </p>
                </div>
            `,actions:[{label:r,variant:"btn-secondary",onClick:d},{label:a,variant:s,onClick:l}],showClose:!1})}static renderTable(e={}){const{columns:t=[],data:i=[],emptyMessage:a="No data available",rowActions:r=[],multiSelect:s=!1}=e;return`
            <table class="data-table">
                <thead>
                    <tr>
                        ${s?'<th style="width: 40px;"></th>':""}
                        ${t.map(n=>`
                            <th ${n.sortable?`class="sortable" onclick="${n.onSort}"`:""}>
                                ${H.escapeHtml(n.label)}
                                ${n.sortable?'<i class="fas fa-sort"></i>':""}
                            </th>
                        `).join("")}
                        ${r.length>0?"<th>Actions</th>":""}
                    </tr>
                </thead>
                <tbody>
                    ${i.length>0?i.map((n,c)=>`
                        <tr data-id="${n.id||c}">
                            ${s?`<td>${this.renderCheckbox(n.id)}</td>`:""}
                            ${t.map(l=>`
                                <td>${l.render?l.render(n):H.escapeHtml(String(n[l.key]||"-"))}</td>
                            `).join("")}
                            ${r.length>0?`
                                <td>
                                    ${r.map(l=>this.renderIconButton(l.icon,`${l.onClick}('${n.id}')`,{title:l.label,variant:l.variant||""})).join("")}
                                </td>
                            `:""}
                        </tr>
                    `).join(""):`
                        <tr>
                            <td colspan="${t.length+(s?1:0)+(r.length>0?1:0)}" class="empty-state">
                                ${H.escapeHtml(a)}
                            </td>
                        </tr>
                    `}
                </tbody>
            </table>
        `}static renderCheckbox(e,t=!1,i="app.handleCheckbox"){return`
            <input
                type="checkbox"
                ${t?"checked":""}
                onchange="${i}('${e}', this.checked)"
                data-id="${e}"
            >
        `}static createToastConfig(e,t="info",i=5e3){return{message:e,type:t,duration:i}}}const N={ROLES:{key:"roles",ttl:24*60*60*1e3},ROLE_DEFINITIONS:{key:"roleDefinitions",ttl:24*60*60*1e3},GROUPS:{key:"groups",ttl:5*60*1e3},TEMPLATES:{key:"templates",ttl:5*60*1e3},HEALTH_CHECK:{key:"healthCheck",ttl:5*60*1e3},COVERAGE:{key:"coverage",ttl:5*60*1e3},ASSIGNMENTS:{key:"assignments",ttl:2*60*1e3},EXPIRING_ASSIGNMENTS:{key:"expiringAssignments",ttl:2*60*1e3},APPROVALS:{key:"approvals",ttl:1*60*1e3},AUDIT_LOGS:{key:"auditLogs",ttl:1*60*1e3},DASHBOARD_STATS:{key:"dashboardStats",ttl:30*1e3}};class Es{constructor(){this.cache=new Map,this.timestamps=new Map,this.hitCount=0,this.missCount=0}get(e,t=null){if(!this.cache.has(e))return this.missCount++,null;const i=Date.now()-this.timestamps.get(e),a=t||this.getDefaultTTL(e);return i>a?(this.cache.delete(e),this.timestamps.delete(e),this.missCount++,null):(this.hitCount++,this.cache.get(e))}set(e,t,i=null){this.cache.set(e,t),this.timestamps.set(e,Date.now()),i&&this.cache.set(`${e}__ttl`,i)}has(e){return this.get(e)!==null}invalidate(e){this.cache.delete(e),this.timestamps.delete(e),this.cache.delete(`${e}__ttl`)}invalidatePattern(e){const t=typeof e=="string"?new RegExp(e):e,i=[];for(const a of this.cache.keys())t.test(a)&&i.push(a);i.forEach(a=>this.invalidate(a))}clear(){this.cache.clear(),this.timestamps.clear(),this.hitCount=0,this.missCount=0}clearExpired(){let e=0;const t=[];for(const[i,a]of this.timestamps.entries()){const r=Date.now()-a,s=this.getDefaultTTL(i);r>s&&t.push(i)}return t.forEach(i=>{this.invalidate(i),e++}),e}getDefaultTTL(e){const t=this.cache.get(`${e}__ttl`);if(t)return t;const i=Object.values(N).find(a=>a.key===e);return i?i.ttl:5*60*1e3}getStats(){const e=this.hitCount+this.missCount,t=e>0?(this.hitCount/e*100).toFixed(2):0;return{size:this.cache.size,hits:this.hitCount,misses:this.missCount,hitRate:`${t}%`,totalRequests:e}}getAge(e){return this.timestamps.has(e)?Date.now()-this.timestamps.get(e):-1}getRemainingTTL(e){if(!this.timestamps.has(e))return-1;const t=this.getAge(e),i=this.getDefaultTTL(e);return Math.max(0,i-t)}warmCache(e){Object.entries(e).forEach(([t,i])=>{this.set(t,i)})}getKeys(){return Array.from(this.cache.keys()).filter(e=>!e.endsWith("__ttl"))}exportState(){const e={};for(const t of this.getKeys())e[t]={value:this.cache.get(t),age:this.getAge(t),remainingTTL:this.getRemainingTTL(t),ttl:this.getDefaultTTL(t)};return e}}const vl=new Es;setInterval(()=>{const o=vl.clearExpired();o>0&&console.log(`[CacheManager] Auto-cleaned ${o} expired entries`)},5*60*1e3);class yl{constructor(){this.currentPage="dashboard",this.pages=new Map,this.beforeNavigate=null,this.afterNavigate=null}registerPage(e,t){if(!t||typeof t.render!="function")throw new Error(`Page ${e} must have a render() method`);this.pages.set(e,t)}registerPages(e){Object.entries(e).forEach(([t,i])=>{this.registerPage(t,i)})}async navigateTo(e,t={}){if(!this.pages.has(e))return console.error(`[PageRouter] Page not found: ${e}`),!1;if(this.beforeNavigate&&await this.beforeNavigate(this.currentPage,e,t)===!1)return!1;this.updateNavigation(e),this.updatePageVisibility(e);const i=this.currentPage;this.currentPage=e;try{const a=this.pages.get(e),r=document.getElementById(`page-${e}`);return r?(await a.render(r,t),this.afterNavigate&&await this.afterNavigate(i,e,t),!0):(console.error(`[PageRouter] Container not found for page: ${e}`),!1)}catch(a){return console.error(`[PageRouter] Error rendering page ${e}:`,a),this.showErrorState(e,a),!1}}updateNavigation(e){document.querySelectorAll(".nav-item").forEach(t=>{t.classList.remove("active"),t.dataset.page===e&&t.classList.add("active")})}updatePageVisibility(e){document.querySelectorAll(".page").forEach(i=>{i.classList.remove("active")});const t=document.getElementById(`page-${e}`);t&&t.classList.add("active")}showErrorState(e,t){const i=document.getElementById(`page-${e}`);i&&(i.innerHTML=`
            <div class="error-state" style="text-align: center; padding: var(--space-2xl);">
                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--color-error-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3.5rem; color: var(--color-error);"></i>
                </div>
                <h2 style="font-family: var(--font-display); font-size: 1.8rem; font-weight: 800; margin-bottom: var(--space-md); color: var(--color-error);">
                    Error Loading Page
                </h2>
                <p style="color: var(--text-secondary); margin-bottom: var(--space-xl); font-family: var(--font-mono); font-size: 0.9rem;">
                    ${t.message||"An unexpected error occurred"}
                </p>
                <button class="btn btn-primary" onclick="app.router.navigateTo('${e}')">
                    <i class="fas fa-redo"></i> Try Again
                </button>
                <button class="btn btn-secondary" onclick="app.router.navigateTo('dashboard')" style="margin-left: var(--space-sm);">
                    <i class="fas fa-home"></i> Go to Dashboard
                </button>
            </div>
        `)}async refreshCurrentPage(e={}){return await this.navigateTo(this.currentPage,e)}getCurrentPage(){return this.currentPage}hasPage(e){return this.pages.has(e)}getRegisteredPages(){return Array.from(this.pages.keys())}setBeforeNavigate(e){this.beforeNavigate=e}setAfterNavigate(e){this.afterNavigate=e}}class V{constructor(e){this.app=e}async render(e,t={}){throw new Error("render() must be implemented by subclass")}showLoading(e="Loading..."){this.app&&this.app.showLoading&&this.app.showLoading(e)}hideLoading(){this.app&&this.app.hideLoading&&this.app.hideLoading()}showToast(e,t="info"){this.app&&this.app.showToast&&this.app.showToast(e,t)}showModal(e){this.app&&this.app.showModal&&this.app.showModal(e)}closeModal(){this.app&&this.app.closeModal&&this.app.closeModal()}escapeHtml(e){if(this.app&&this.app.escapeHtml)return this.app.escapeHtml(e);const t=document.createElement("div");return t.textContent=e,t.innerHTML}getCached(e){var t,i;return((i=(t=this.app)==null?void 0:t.cacheManager)==null?void 0:i.get(e))||null}setCached(e,t){var i,a;(a=(i=this.app)==null?void 0:i.cacheManager)==null||a.set(e,t)}isConnected(){var e;return((e=this.app)==null?void 0:e.isConnected)||!1}}class bl{constructor(){this.lastFocusedElement=null,this.modalStack=[],this.skipLinksAdded=!1}initialize(){this.addSkipLinks(),this.setupKeyboardNavigation(),this.setupFocusManagement(),this.enhanceModals(),this.setupLiveRegion(),console.log("AccessibilityManager initialized")}addSkipLinks(){if(this.skipLinksAdded)return;const e=document.createElement("div");e.className="skip-links",e.setAttribute("role","navigation"),e.setAttribute("aria-label","Skip links"),e.innerHTML=`
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
        `,document.body.insertBefore(e,document.body.firstChild),this.skipLinksAdded=!0,this.addSkipLinkStyles()}addSkipLinkStyles(){const e=document.createElement("style");e.textContent=`
            .skip-links {
                position: absolute;
                top: -1000px;
                left: -1000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            }

            .skip-link:focus {
                position: fixed;
                top: 10px;
                left: 10px;
                width: auto;
                height: auto;
                padding: 0.75rem 1.5rem;
                background: var(--accent-primary);
                color: var(--bg-primary);
                font-family: var(--font-display);
                font-weight: 700;
                text-decoration: none;
                border-radius: var(--radius-md);
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            .skip-link:focus:hover {
                background: var(--accent-primary-bright);
            }

            /* Focus visible styles for better keyboard navigation */
            *:focus-visible {
                outline: 2px solid var(--accent-primary);
                outline-offset: 2px;
            }

            /* Remove default focus for mouse users */
            *:focus:not(:focus-visible) {
                outline: none;
            }
        `,document.head.appendChild(e)}setupKeyboardNavigation(){document.addEventListener("keydown",e=>{if(e.altKey&&e.key==="n"&&(e.preventDefault(),this.focusNavigation(),this.announce("Navigation menu focused")),e.altKey&&e.key==="m"&&(e.preventDefault(),this.focusMainContent(),this.announce("Main content focused")),e.altKey&&e.key==="s"){e.preventDefault();const t=document.querySelector('[role="search"] input, #group-search, #role-search');t&&(t.focus(),this.announce("Search focused"))}})}setupFocusManagement(){window.addEventListener("popstate",()=>{requestAnimationFrame(()=>{this.focusMainContent()})}),document.addEventListener("focus",e=>{if(e.target.matches("button:not([aria-label]):not([title])")){const t=e.target.textContent.trim();t&&e.target.setAttribute("aria-label",t)}},!0)}enhanceModals(){const e=document.getElementById("modal-container");if(!e)return;new MutationObserver(i=>{i.forEach(a=>{a.attributeName==="class"&&(!e.classList.contains("hidden")?this.handleModalOpen(e):this.handleModalClose())})}).observe(e,{attributes:!0}),e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.setAttribute("aria-hidden","true")}handleModalOpen(e){this.lastFocusedElement=document.activeElement,this.modalStack.push(this.lastFocusedElement),e.setAttribute("aria-hidden","false");const t=e.querySelector("#modal-content"),i=t==null?void 0:t.querySelector("h2, h3, .modal-title");i&&!i.id&&(i.id=`modal-title-${Date.now()}`),i&&e.setAttribute("aria-labelledby",i.id),requestAnimationFrame(()=>{const a=this.getFocusableElements(t)[0];a&&a.focus()}),this.setupTabTrap(e),this.announce("Dialog opened")}handleModalClose(){document.getElementById("modal-container").setAttribute("aria-hidden","true");const t=this.modalStack.pop();t&&typeof t.focus=="function"&&setTimeout(()=>{try{t.focus()}catch{this.focusMainContent()}},100),this.announce("Dialog closed")}setupTabTrap(e){const t=e.querySelector("#modal-content");if(!t)return;const i=a=>{if(a.key!=="Tab")return;const r=this.getFocusableElements(t),s=r[0],n=r[r.length-1];if(r.length===0){a.preventDefault();return}a.shiftKey&&document.activeElement===s?(a.preventDefault(),n.focus()):!a.shiftKey&&document.activeElement===n&&(a.preventDefault(),s.focus())};e.removeEventListener("keydown",i),e.addEventListener("keydown",i)}getFocusableElements(e){return e?Array.from(e.querySelectorAll(`
            a[href]:not([disabled]),
            button:not([disabled]),
            textarea:not([disabled]),
            input:not([type="hidden"]):not([disabled]),
            select:not([disabled]),
            [tabindex]:not([tabindex="-1"]):not([disabled])
        `)).filter(i=>i.offsetParent!==null&&window.getComputedStyle(i).visibility!=="hidden"):[]}focusNavigation(){const e=document.querySelector('.sidebar, [role="navigation"]');if(e){const t=e.querySelector(".nav-item, a");t&&t.focus()}}focusMainContent(){const e=document.getElementById("main-content")||document.querySelector("main, .content-wrapper");e&&(e.hasAttribute("tabindex")||e.setAttribute("tabindex","-1"),e.focus(),setTimeout(()=>{e.removeAttribute("tabindex")},100))}setupLiveRegion(){let e=document.getElementById("a11y-live-region");if(!e){e=document.createElement("div"),e.id="a11y-live-region",e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","true"),e.className="sr-only";const t=document.createElement("style");t.textContent=`
                .sr-only {
                    position: absolute;
                    width: 1px;
                    height: 1px;
                    padding: 0;
                    margin: -1px;
                    overflow: hidden;
                    clip: rect(0, 0, 0, 0);
                    white-space: nowrap;
                    border: 0;
                }
            `,document.head.appendChild(t),document.body.appendChild(e)}this.liveRegion=e}announce(e,t="polite"){this.liveRegion||this.setupLiveRegion(),this.liveRegion.setAttribute("aria-live",t),this.liveRegion.textContent="",setTimeout(()=>{this.liveRegion.textContent=e},100),setTimeout(()=>{this.liveRegion.textContent=""},1e3)}enhanceForm(e){if(!e)return;e.querySelectorAll("input, select, textarea").forEach(a=>{a.id||(a.id=`input-${Date.now()}-${Math.random().toString(36).substr(2,9)}`);let r=e.querySelector(`label[for="${a.id}"]`);if(r||(r=a.closest("label")),!r&&(a.placeholder||a.name)){const s=a.placeholder||a.name;a.setAttribute("aria-label",s)}a.hasAttribute("required")&&!a.hasAttribute("aria-required")&&a.setAttribute("aria-required","true"),(a.classList.contains("error")||a.classList.contains("invalid"))&&a.setAttribute("aria-invalid","true")});const i=e.querySelectorAll(".error-message, .field-error");if(i.length>0){const a=Array.from(i).map(r=>r.textContent).join(", ");this.announce(`Form has ${i.length} error${i.length>1?"s":""}: ${a}`,"assertive")}}enhanceTable(e){if(!e)return;if(e.hasAttribute("role")||e.setAttribute("role","table"),!e.querySelector("caption")){const a=document.createElement("caption");a.className="sr-only",a.textContent=e.getAttribute("aria-label")||"Data table",e.insertBefore(a,e.firstChild)}const t=e.querySelector("thead");t&&(t.setAttribute("role","rowgroup"),t.querySelectorAll("tr").forEach(a=>{a.setAttribute("role","row")}),t.querySelectorAll("th").forEach(a=>{a.setAttribute("role","columnheader"),a.hasAttribute("scope")||a.setAttribute("scope","col")}));const i=e.querySelector("tbody");i&&(i.setAttribute("role","rowgroup"),i.querySelectorAll("tr").forEach(a=>{a.setAttribute("role","row")}),i.querySelectorAll("td").forEach(a=>{a.setAttribute("role","cell")})),e.querySelectorAll("th.sortable").forEach(a=>{a.hasAttribute("aria-sort")||a.setAttribute("aria-sort","none")})}announcePageChange(e){const t=e.split("-").map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join(" ");this.announce(`Navigated to ${t} page`,"polite")}announceLoading(e,t=""){e?this.announce(`Loading${t?": "+t:"..."}`,"polite"):this.announce("Loading complete","polite")}}const ht=new bl;class Cl extends V{constructor(e){super(e)}async render(e,t={}){if(!this.isConnected()){this.renderLandingPage(e);return}let i={totalGroups:0,eligibleAssignments:0,activeAssignments:0,pendingApprovals:0,expiringAssignments:0,healthScore:0,healthStatus:"unknown"},a=[],r=[],s=[];if(this.isConnected()){this.showLoading("Loading dashboard data...");try{const d=this.getCached(N.DASHBOARD_STATS.key);if(d)i=d.stats,a=d.recentActivities,r=d.expiringList,s=d.healthWarnings;else{const[u,p,h,m,v]=await Promise.all([E.getPIMGroups(),E.getRoleAssignmentsWithExpiration(),E.getPendingApprovals(),E.runHealthCheck(),E.getPIMAuditLogs(7)]);u.success&&(i.totalGroups=u.count),p.success&&(i.activeAssignments=p.activeCount,i.eligibleAssignments=p.eligibleCount,i.expiringAssignments=p.expiringCount,r=p.expiringAssignments.slice(0,5)),h.success&&(i.pendingApprovals=h.count),m.success&&(i.healthScore=m.healthScore,i.healthStatus=m.status,s=m.warnings||[]),v.success&&(a=v.logs.slice(0,5)),this.setCached(N.DASHBOARD_STATS.key,{stats:i,recentActivities:a,expiringList:r,healthWarnings:s})}}catch(d){console.error("Dashboard load error:",d)}this.hideLoading()}const n=this.app.isConfigured?"":`
            <div class="setup-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Setup Required</strong>
                    <p>Click the <strong>Setup</strong> button in the sidebar to configure PIMBuddy for your tenant.</p>
                </div>
                <button class="btn btn-primary btn-sm" onclick="app.showSetupWizard()">Run Setup</button>
            </div>
        `,c=d=>d?new Date(d).toLocaleString():"N/A",l=d=>{if(!d)return"N/A";const h=new Date(d)-new Date,m=Math.floor(h/(1e3*60*60*24)),v=Math.floor(h%(1e3*60*60*24)/(1e3*60*60));return m>0?`in ${m}d ${v}h`:v>0?`in ${v}h`:"soon"};e.innerHTML=`
            <!-- Dramatic Dashboard Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -100%; right: -10%; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(100px); animation: float 12s ease-in-out infinite; pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(0, 255, 159, 0.05); border: 1px solid var(--accent-primary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <span style="width: 6px; height: 6px; background: var(--accent-primary); border-radius: 50%; box-shadow: 0 0 10px var(--accent-primary); animation: pulse 2s ease-in-out infinite;"></span>
                        <span style="color: var(--accent-primary); font-weight: 600;">SYSTEM STATUS</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">REALTIME MONITORING</span>
                    </div>

                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(0, 255, 159, 0.3));">
                            COMMAND
                        </span>
                        <span style="color: var(--text-primary);"> CENTER</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Privileged Access Management Overview
                    </p>
                </div>
            </div>

            ${n}

            <!-- Dramatic Stats Grid -->
            <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
                <!-- Health Score - Hero Card -->
                <div class="card stat-card ${i.healthScore>0?"clickable":""}"
                     onclick="${i.healthScore>0?"app.router.navigateTo('health-check')":""}"
                     style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 2px solid ${i.healthStatus==="healthy"?"var(--accent-primary)":i.healthStatus==="warning"?"var(--color-warning)":"var(--color-error)"};" role="button" ${i.healthScore>0?'aria-label="View health check details"':""} tabindex="${i.healthScore>0?"0":"-1"}">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at top right, ${i.healthStatus==="healthy"?"var(--accent-primary-dim)":i.healthStatus==="warning"?"rgba(255, 170, 0, 0.1)":"rgba(255, 0, 85, 0.1)"}, transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 64px; height: 64px; background: ${i.healthStatus==="healthy"?"var(--accent-primary-dim)":i.healthStatus==="warning"?"var(--color-warning-dim)":"rgba(255, 0, 85, 0.1)"}; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md); box-shadow: 0 0 30px ${i.healthStatus==="healthy"?"rgba(0, 255, 159, 0.3)":i.healthStatus==="warning"?"rgba(255, 170, 0, 0.3)":"rgba(255, 0, 85, 0.3)"};">
                            <i class="fas fa-heart-pulse" style="font-size: 2rem; color: ${i.healthStatus==="healthy"?"var(--accent-primary)":i.healthStatus==="warning"?"var(--color-warning)":"var(--color-error)"};"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 3rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); background: linear-gradient(135deg, ${i.healthStatus==="healthy"?"var(--accent-primary), #00ffff":i.healthStatus==="warning"?"var(--color-warning), #ffdd00":"var(--color-error), #ff0099"}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            ${i.healthScore}%
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono); margin-bottom: var(--space-xs);">HEALTH SCORE</div>
                        ${i.healthScore>0?'<div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">⚡ CLICK FOR ANALYSIS</div>':""}
                    </div>
                </div>

                <!-- Other Stat Cards -->
                <div class="card stat-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(0, 255, 159, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-users" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                            ${i.totalGroups}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">PIM GROUPS</div>
                    </div>
                </div>

                <div class="card stat-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 0, 128, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-user-check" style="font-size: 1.5rem; color: var(--accent-secondary);"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                            ${i.eligibleAssignments}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">ELIGIBLE</div>
                    </div>
                </div>

                <div class="card stat-card" style="position: relative; overflow: hidden;">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(0, 255, 159, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: var(--color-success-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-user-shield" style="font-size: 1.5rem; color: var(--color-success);"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                            ${i.activeAssignments}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">ACTIVE</div>
                    </div>
                </div>

                <div class="card stat-card ${i.expiringAssignments>0?"clickable":""}"
                     onclick="${i.expiringAssignments>0?"app.router.navigateTo('expiring-assignments')":""}"
                     style="position: relative; overflow: hidden; ${i.expiringAssignments>0?"border: 1px solid var(--color-warning);":""}" role="${i.expiringAssignments>0?"button":""}" ${i.expiringAssignments>0?'aria-label="View expiring assignments"':""} tabindex="${i.expiringAssignments>0?"0":"-1"}">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 170, 0, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: ${i.expiringAssignments>0?"var(--color-warning-dim)":"var(--bg-elevated)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-hourglass-end" style="font-size: 1.5rem; color: ${i.expiringAssignments>0?"var(--color-warning)":"var(--text-muted)"};"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: ${i.expiringAssignments>0?"var(--color-warning)":"var(--text-primary)"};">
                            ${i.expiringAssignments}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">EXPIRING</div>
                        ${i.expiringAssignments>0?'<div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">⚡ CLICK TO VIEW</div>':""}
                    </div>
                </div>

                <div class="card stat-card ${i.pendingApprovals>0?"clickable":""}"
                     onclick="${i.pendingApprovals>0?"app.router.navigateTo('pending-approvals')":""}"
                     style="position: relative; overflow: hidden; ${i.pendingApprovals>0?"border: 1px solid var(--color-warning);":""}" role="${i.pendingApprovals>0?"button":""}" ${i.pendingApprovals>0?'aria-label="Review pending approvals"':""} tabindex="${i.pendingApprovals>0?"0":"-1"}">
                    <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 170, 0, 0.05), transparent); filter: blur(40px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="width: 56px; height: 56px; background: ${i.pendingApprovals>0?"var(--color-warning-dim)":"var(--bg-elevated)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                            <i class="fas fa-clock" style="font-size: 1.5rem; color: ${i.pendingApprovals>0?"var(--color-warning)":"var(--text-muted)"};"></i>
                        </div>
                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: ${i.pendingApprovals>0?"var(--color-warning)":"var(--text-primary)"};">
                            ${i.pendingApprovals}
                        </div>
                        <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">APPROVALS</div>
                        ${i.pendingApprovals>0?'<div style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono);">⚡ CLICK TO REVIEW</div>':""}
                    </div>
                </div>
            </div>

            <!-- Dashboard Grid with Asymmetric Layout -->
            <div class="dashboard-grid">
                <!-- Quick Actions - Cyberpunk Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                    <div style="position: absolute; top: -50%; right: -20%; width: 250px; height: 250px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="width: 40px; height: 40px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-bolt" style="color: var(--accent-primary); font-size: 1.2rem;"></i>
                            </div>
                            <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                Quick Actions
                            </h2>
                        </div>
                        <div class="quick-actions" style="display: flex; flex-direction: column; gap: var(--space-sm);">
                            <button class="btn btn-primary btn-block" onclick="app.router.navigateTo('baseline')" ${this.isConnected()?"":"disabled"} style="position: relative; overflow: hidden; text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="Deploy baseline configuration">
                                <i class="fas fa-rocket"></i>
                                <span>Deploy Baseline Configuration</span>
                            </button>
                            <button class="btn btn-secondary btn-block" onclick="app.router.navigateTo('health-check')" ${this.isConnected()?"":"disabled"} style="text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="Run security health scan">
                                <i class="fas fa-heart-pulse"></i>
                                <span>Run Security Health Scan</span>
                            </button>
                            <button class="btn btn-secondary btn-block" onclick="app.router.navigateTo('pim-activity')" ${this.isConnected()?"":"disabled"} style="text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="View audit activity log">
                                <i class="fas fa-history"></i>
                                <span>View Audit Activity Log</span>
                            </button>
                            <button class="btn btn-secondary btn-block" onclick="app.router.navigateTo('role-coverage')" ${this.isConnected()?"":"disabled"} style="text-align: left; justify-content: flex-start; gap: var(--space-md);" aria-label="Analyze coverage report">
                                <i class="fas fa-chart-pie"></i>
                                <span>Analyze Coverage Report</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Health Warnings - Alert Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${s.length>0?"var(--color-warning)":"var(--border-subtle)"};">
                    <div style="position: absolute; top: -50%; left: -20%; width: 250px; height: 250px; background: radial-gradient(circle, ${s.length>0?"rgba(255, 170, 0, 0.05)":"var(--accent-secondary-dim)"}, transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="width: 40px; height: 40px; background: ${s.length>0?"var(--color-warning-dim)":"var(--accent-secondary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas ${s.length>0?"fa-exclamation-triangle":"fa-shield-check"}" style="color: ${s.length>0?"var(--color-warning)":"var(--accent-secondary)"}; font-size: 1.2rem;"></i>
                            </div>
                            <div style="flex: 1;">
                                <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Alerts & Warnings
                                </h2>
                            </div>
                            ${s.length>0?`<span class="badge" style="background: var(--color-warning-dim); color: var(--color-warning); font-family: var(--font-mono); font-size: 0.7rem;" aria-label="${s.length} warnings">${s.length}</span>`:""}
                        </div>
                        <div class="recommendations-list" style="max-height: 300px; overflow-y: auto;">
                            ${s.length>0?s.map(d=>`
                                <div style="padding: var(--space-md); margin-bottom: var(--space-sm); background: rgba(255, 170, 0, 0.05); border-left: 3px solid ${d.severity==="warning"?"var(--color-warning)":"var(--color-info)"}; border-radius: var(--radius-sm);" role="alert">
                                    <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                        <i class="fas ${d.severity==="warning"?"fa-exclamation-triangle":"fa-info-circle"}" style="color: ${d.severity==="warning"?"var(--color-warning)":"var(--color-info)"}; margin-top: 2px;" aria-hidden="true"></i>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: ${d.severity==="warning"?"var(--color-warning)":"var(--color-info)"}; margin-bottom: var(--space-xs);">
                                                ${this.escapeHtml(d.category)}
                                            </div>
                                            <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
                                                ${this.escapeHtml(d.message)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `).join(""):`
                                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-shield-check" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                    </div>
                                    <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                        All Systems Operational
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        No security issues detected
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Recent Activity - Data Stream Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                    <div style="position: absolute; bottom: -50%; left: -20%; width: 250px; height: 250px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                <div style="width: 40px; height: 40px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-history" style="color: var(--accent-secondary); font-size: 1.2rem;"></i>
                                </div>
                                <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Recent Activity
                                </h2>
                            </div>
                            <button class="btn btn-sm btn-secondary" onclick="app.router.navigateTo('pim-activity')" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono); font-size: 0.7rem;" aria-label="View all activity">
                                VIEW ALL →
                            </button>
                        </div>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${a.length>0?a.map((d,u)=>{var p,h;return`
                                <div style="padding: var(--space-md); margin-bottom: var(--space-xs); background: ${u%2===0?"rgba(255, 0, 128, 0.02)":"rgba(0, 255, 159, 0.02)"}; border-left: 2px solid ${u%2===0?"var(--accent-secondary)":"var(--accent-primary)"}; border-radius: var(--radius-sm);">
                                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-md);">
                                        <div style="flex: 1; min-width: 0;">
                                            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: var(--space-xs); color: var(--text-primary); overflow: hidden; text-overflow: ellipsis;">
                                                ${this.escapeHtml(d.activityDisplayName||"Activity")}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-mono);">
                                                <i class="fas fa-user" style="font-size: 0.7rem;"></i>
                                                <span>${this.escapeHtml(((h=(p=d.initiatedBy)==null?void 0:p.user)==null?void 0:h.displayName)||"System")}</span>
                                            </div>
                                        </div>
                                        <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); white-space: nowrap;">
                                            ${c(d.activityDateTime)}
                                        </div>
                                    </div>
                                </div>
                            `}).join(""):`
                                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-inbox" style="font-size: 2.5rem; color: var(--accent-secondary); opacity: 0.5;"></i>
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        ${this.isConnected()?"No recent activity detected":"Connect to view activity stream"}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- Expiring Assignments - Warning Panel -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${r.length>0?"var(--color-warning)":"var(--border-subtle)"};">
                    <div style="position: absolute; bottom: -50%; right: -20%; width: 250px; height: 250px; background: radial-gradient(circle, ${r.length>0?"rgba(255, 170, 0, 0.05)":"var(--accent-primary-dim)"}, transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-lg); padding-bottom: var(--space-md); border-bottom: 1px solid var(--border-subtle);">
                            <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                <div style="width: 40px; height: 40px; background: ${r.length>0?"var(--color-warning-dim)":"var(--accent-primary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-hourglass-end" style="color: ${r.length>0?"var(--color-warning)":"var(--accent-primary)"}; font-size: 1.2rem;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                        Expiring Soon
                                    </h2>
                                </div>
                                ${r.length>0?`<span class="badge" style="background: var(--color-warning-dim); color: var(--color-warning); font-family: var(--font-mono); font-size: 0.7rem;" aria-label="${r.length} expiring">${r.length}</span>`:""}
                            </div>
                            <button class="btn btn-sm btn-secondary" onclick="app.router.navigateTo('expiring-assignments')" ${!this.isConnected()||r.length===0?"disabled":""} style="font-family: var(--font-mono); font-size: 0.7rem;" aria-label="View all expiring assignments">
                                VIEW ALL →
                            </button>
                        </div>
                        <div style="max-height: 300px; overflow-y: auto;">
                            ${r.length>0?r.map(d=>{var u,p;return`
                                <div style="padding: var(--space-md); margin-bottom: var(--space-sm); background: rgba(255, 170, 0, 0.05); border-left: 3px solid var(--color-warning); border-radius: var(--radius-sm);">
                                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-md);">
                                        <div style="flex: 1; min-width: 0;">
                                            <div style="font-weight: 600; font-size: 0.95rem; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                                ${this.escapeHtml(((u=d.principal)==null?void 0:u.displayName)||"Unknown")}
                                            </div>
                                            <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--text-secondary); flex-wrap: wrap;">
                                                <span style="font-family: var(--font-mono);">${this.escapeHtml(((p=d.roleDefinition)==null?void 0:p.displayName)||"Unknown Role")}</span>
                                                <span class="badge" style="background: ${d.type==="active"?"var(--color-success-dim)":"var(--bg-elevated)"}; color: ${d.type==="active"?"var(--color-success)":"var(--text-secondary)"}; font-size: 0.7rem; text-transform: uppercase;">
                                                    ${d.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--color-warning); font-family: var(--font-mono); white-space: nowrap; font-weight: 600;">
                                            <i class="fas fa-clock" style="font-size: 0.7rem;"></i>
                                            <span>${l(d.endDateTime)}</span>
                                        </div>
                                    </div>
                                </div>
                            `}).join(""):`
                                <div style="text-align: center; padding: var(--space-2xl); color: var(--text-secondary);">
                                    <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-check-circle" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                    </div>
                                    <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                        All Clear
                                    </div>
                                    <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        ${this.isConnected()?"No assignments expiring within 7 days":"Connect to monitor expiring assignments"}
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `}renderLandingPage(e){e.innerHTML=`
            <!-- Hero Section -->
            <div style="text-align: center; padding: var(--space-xl) 0; max-width: 1200px; margin: 0 auto;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 120px; height: 120px; background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border-radius: 30px; margin-bottom: var(--space-lg); box-shadow: 0 20px 60px rgba(0, 212, 170, 0.3);">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; color: var(--accent-primary);"></i>
                </div>

                <h1 style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; margin-bottom: var(--space-md); background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Welcome to PIMBuddy
                </h1>

                <p style="font-size: 1.3rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto var(--space-xl);">
                    Your complete solution for Microsoft Entra PIM management. Deploy, monitor, and secure privileged access with enterprise-grade tools.
                </p>

                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.1rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);" aria-label="Connect to Microsoft Entra ID">
                    <i class="fas fa-plug"></i> Connect to Get Started
                </button>
            </div>

            <!-- Key Stats -->
            <div class="stats-grid" style="margin-bottom: var(--space-xl);">
                <div class="card stat-card" style="border-color: var(--accent-primary-dim);">
                    <div class="stat-icon primary">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="stat-value">5</div>
                    <div class="stat-label">Monitoring Tools</div>
                </div>
                <div class="card stat-card" style="border-color: var(--accent-secondary-dim);">
                    <div class="stat-icon secondary">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Baseline Templates</div>
                </div>
                <div class="card stat-card" style="border-color: var(--color-success-dim);">
                    <div class="stat-icon success">
                        <i class="fas fa-shield-check"></i>
                    </div>
                    <div class="stat-value">100%</div>
                    <div class="stat-label">Zero Trust Ready</div>
                </div>
            </div>

            <!-- Core Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-stars" style="color: var(--accent-primary);"></i> Core Features
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- Baseline Deployment -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-primary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-rocket" style="font-size: 1.8rem; color: var(--accent-primary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Baseline Deployment</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">One-Click PIM Setup</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Deploy complete PIM configurations instantly with industry best practices. Choose from Enterprise Standard, High Security (Zero Trust), or Quick Start templates.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-primary"><i class="fas fa-check"></i> Tiered Access (T0/T1/T2)</span>
                        <span class="badge badge-success"><i class="fas fa-check"></i> MFA Required</span>
                        <span class="badge badge-info"><i class="fas fa-check"></i> Approval Workflows</span>
                        <span class="badge badge-warning"><i class="fas fa-check"></i> Auto-Configuration</span>
                    </div>
                </div>

                <!-- PIM Health Check -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-success-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-success-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-heart-pulse" style="font-size: 1.8rem; color: var(--color-success);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Health Check Scanner</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Security Analysis</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Automated security scanner that analyzes your PIM configuration. Get a health score (0-100%) and actionable recommendations to improve security.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-search"></i> Auto-Scan</span>
                        <span class="badge badge-primary"><i class="fas fa-chart-line"></i> Health Score</span>
                        <span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Issue Detection</span>
                        <span class="badge badge-info"><i class="fas fa-lightbulb"></i> Recommendations</span>
                    </div>
                </div>

                <!-- Activity Monitoring -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-secondary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-secondary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-history" style="font-size: 1.8rem; color: var(--accent-secondary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">PIM Activity Log</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Audit & Compliance</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Complete audit trail of all PIM role management activities. Track who did what, when, and why with detailed activity logs and filtering.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-secondary"><i class="fas fa-calendar"></i> 30-Day History</span>
                        <span class="badge badge-info"><i class="fas fa-filter"></i> Advanced Filtering</span>
                        <span class="badge badge-primary"><i class="fas fa-download"></i> Export Logs</span>
                    </div>
                </div>

                <!-- Approval Management -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-warning-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-clock" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Pending Approvals</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Request Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Manage PIM activation requests in one place. Review justifications, approve or deny requests, and maintain compliance with one-click actions.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-check"></i> Quick Approve</span>
                        <span class="badge badge-danger"><i class="fas fa-times"></i> Quick Deny</span>
                        <span class="badge badge-info"><i class="fas fa-comment"></i> Justification View</span>
                    </div>
                </div>

                <!-- Expiring Assignments -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(245, 158, 11, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-hourglass-end" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Expiring Assignments</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Lifecycle Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Track role assignments expiring within 7 days. Proactive monitoring prevents access loss and ensures continuous operations.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-warning"><i class="fas fa-bell"></i> 7-Day Alerts</span>
                        <span class="badge badge-primary"><i class="fas fa-clock"></i> Time Remaining</span>
                        <span class="badge badge-info"><i class="fas fa-list"></i> Full Tracking</span>
                    </div>
                </div>

                <!-- Role Coverage -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.15); border-radius: var(--radius-lg);">
                            <i class="fas fa-chart-pie" style="font-size: 1.8rem; color: var(--color-info);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Role Coverage Report</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Analytics Dashboard</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Analyze which roles are managed through PIM groups vs direct assignments. Visual reports help identify gaps and improve governance.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-info"><i class="fas fa-chart-pie"></i> Visual Reports</span>
                        <span class="badge badge-primary"><i class="fas fa-percent"></i> Coverage %</span>
                        <span class="badge badge-warning"><i class="fas fa-flag"></i> Gap Analysis</span>
                    </div>
                </div>
            </div>

            <!-- Additional Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-toolbox" style="color: var(--accent-primary);"></i> Additional Tools
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- PIMMaid -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon primary">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">PIMMaid Visualizer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export your PIM configuration as beautiful Mermaid diagrams. Visualize relationships between users, groups, and roles.
                    </p>
                    <span class="badge badge-secondary"><i class="fas fa-sitemap"></i> Visual Diagrams</span>
                </div>

                <!-- Group Management -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon success">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Group Management</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Create and manage role-assignable security groups. Add/remove members with an intuitive interface.
                    </p>
                    <span class="badge badge-success"><i class="fas fa-user-plus"></i> Member Management</span>
                </div>

                <!-- Role Explorer -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon warning">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Entra Roles Explorer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Browse all Azure AD roles with privilege levels. Search, filter, and understand role permissions.
                    </p>
                    <span class="badge badge-warning"><i class="fas fa-shield-alt"></i> Privilege Levels</span>
                </div>

                <!-- Import/Export -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon info">
                            <i class="fas fa-file-export"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Import/Export</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export configurations for backup or compliance. Import templates to replicate setups across tenants.
                    </p>
                    <span class="badge badge-info"><i class="fas fa-download"></i> Backup & Restore</span>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="card" style="background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border: 2px solid var(--accent-primary); text-align: center; padding: var(--space-xl);">
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Ready to Transform Your PIM Management?
                </h2>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: var(--space-lg); max-width: 600px; margin-left: auto; margin-right: auto;">
                    Connect to your Microsoft Entra ID tenant and start managing privileged access with enterprise-grade tools in minutes.
                </p>
                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.2rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.4);" aria-label="Connect to Microsoft Entra ID">
                    <i class="fas fa-plug"></i> Connect Now
                </button>
            </div>

            <!-- Footer Info -->
            <div style="text-align: center; margin-top: var(--space-xl); padding: var(--space-lg); color: var(--text-muted);">
                <p style="margin-bottom: var(--space-sm);">
                    <i class="fas fa-shield-check" style="color: var(--accent-primary);"></i>
                    Built with enterprise security in mind
                </p>
                <p style="font-size: 0.9rem;">
                    PIMBuddy v1.0.0 | Powered by Microsoft Graph API | Zero Trust Ready
                </p>
            </div>
        `}async refreshPage(){this.app.cacheManager.invalidate(N.DASHBOARD_STATS.key),await this.app.router.refreshCurrentPage()}}class wl extends V{constructor(e){super(e),this.paginator=e.paginators.groups,this.bulkOps=e.bulkOps.groups}async render(e,t={}){let i=[];if(this.isConnected()){if(this.showLoading("Loading groups..."),i=this.getCached(N.GROUPS.key),!i){const r=await E.getPIMGroups();r.success?(i=r.groups,this.setCached(N.GROUPS.key,i)):this.showToast(`Failed to load groups: ${r.error}`,"error")}this.hideLoading()}i=i||[],this.bulkOps.initialize(i,()=>{this.app.router.refreshCurrentPage()}),this.paginator.updateItems(i);const a=this.paginator.getCurrentPageItems();e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">PIM Groups</h1>
                <button class="btn btn-primary" onclick="app.pages.groups.showCreateGroup()" ${this.isConnected()?"":"disabled"}>
                    <i class="fas fa-plus"></i> Create Group
                </button>
            </div>

            <div class="toolbar">
                <input type="text" id="group-search" class="input" placeholder="Search groups..." oninput="app.pages.groups.filterGroups(this.value)">
                <button class="btn btn-secondary" onclick="app.exportUtils.showExportMenu('groups')" ${!this.isConnected()||i.length===0?"disabled":""}>
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="app.pages.groups.refreshPage()" ${this.isConnected()?"":"disabled"}>
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>

            ${this.bulkOps.renderBulkActionsToolbar([{label:"Delete",icon:"fa-trash",variant:"btn-danger",onClick:"app.pages.groups.bulkDeleteGroups()",description:"Delete selected groups"},{label:"Export",icon:"fa-file-export",variant:"btn-secondary",onClick:"app.pages.groups.bulkExportGroups()",description:"Export selected groups"}])}

            <div class="card">
                <table class="data-table" id="groups-table">
                    <thead>
                        <tr>
                            <th style="width: 40px;">
                                ${this.bulkOps.renderHeaderCheckbox("app.pages.groups.toggleAll")}
                            </th>
                            <th>Display Name</th>
                            <th>Description</th>
                            <th>Members</th>
                            <th>Owners</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${a.length>0?a.map(r=>`
                            <tr data-id="${r.id}">
                                <td>
                                    ${this.bulkOps.renderRowCheckbox(r.id,"app.pages.groups.toggleItem")}
                                </td>
                                <td><strong>${this.escapeHtml(r.displayName)}</strong></td>
                                <td>${this.escapeHtml(r.description||"-")}</td>
                                <td>${r.memberCount||0}</td>
                                <td>${r.ownerCount||0}</td>
                                <td>${r.createdDateTime?new Date(r.createdDateTime).toLocaleDateString():"-"}</td>
                                <td>
                                    <button class="icon-btn" onclick="app.pages.groups.manageGroup('${r.id}')" title="Manage" aria-label="Manage group ${this.escapeHtml(r.displayName)}">
                                        <i class="fas fa-cog" aria-hidden="true"></i>
                                    </button>
                                    <button class="icon-btn danger" onclick="app.pages.groups.deleteGroup('${r.id}')" title="Delete" aria-label="Delete group ${this.escapeHtml(r.displayName)}">
                                        <i class="fas fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join(""):`
                            <tr>
                                <td colspan="7" class="empty-state">
                                    ${this.isConnected()?"No PIM groups found":"Connect to view groups"}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>

                ${this.paginator.renderControls("app.pages.groups.handlePageChange")}
            </div>
        `}filterGroups(e){const t=document.querySelectorAll("#groups-table tbody tr"),i=e.toLowerCase();t.forEach(a=>{const r=a.textContent.toLowerCase();a.style.display=r.includes(i)?"":"none"})}handlePageChange(e){this.paginator.goToPage(e),this.app.router.refreshCurrentPage()}handlePageSizeChange(e){this.paginator.setPageSize(e),this.app.router.refreshCurrentPage()}async refreshPage(){this.app.cacheManager.invalidate(N.GROUPS.key),await this.app.router.refreshCurrentPage()}showCreateGroup(){this.showModal(`
            <div class="modal-header">
                <h2 class="modal-title">Create PIM Group</h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="create-group-form">
                    <label class="form-label">
                        Display Name*
                        <input type="text" name="displayName" class="input" required maxlength="256"
                               placeholder="e.g., PIM-Global-Administrators">
                    </label>

                    <label class="form-label">
                        Description
                        <textarea name="description" class="input" rows="3" maxlength="1024"
                                  placeholder="Purpose and scope of this group..."></textarea>
                    </label>

                    <label class="form-label">
                        Mail Nickname*
                        <input type="text" name="mailNickname" class="input" required
                               placeholder="e.g., pim-global-admins"
                               pattern="[a-zA-Z0-9-]+"
                               title="Only letters, numbers, and hyphens allowed">
                        <small class="form-hint">Used for group email address (no spaces)</small>
                    </label>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Create Group
                        </button>
                    </div>
                </form>
            </div>
        `),document.getElementById("create-group-form").addEventListener("submit",async t=>{t.preventDefault(),await this.handleCreateGroup(t.target)})}async handleCreateGroup(e){const t=new FormData(e),i=t.get("displayName").trim(),a=t.get("description").trim(),r=t.get("mailNickname").trim();this.closeModal(),this.showLoading("Creating group...");const s=await E.createPIMGroup(i,a,r);this.hideLoading(),s.success?(this.showToast("Group created successfully","success"),this.refreshPage()):this.showToast(`Failed to create group: ${s.error}`,"error")}async deleteGroup(e){const i=(this.getCached(N.GROUPS.key)||[]).find(r=>r.id===e);if(!i){this.showToast("Group not found","error");return}const a=pt.renderConfirmDialog({title:"Delete PIM Group",message:`Are you sure you want to delete "${i.displayName}"? This action cannot be undone.`,confirmLabel:"Delete Group",confirmVariant:"btn-danger",icon:"fa-trash",iconColor:"error",onConfirm:`app.pages.groups.confirmDeleteGroup('${e}')`});this.showModal(a)}async confirmDeleteGroup(e){this.closeModal(),this.showLoading("Deleting group...");const t=await E.deleteGroup(e);this.hideLoading(),t.success?(this.showToast("Group deleted successfully","success"),this.refreshPage()):this.showToast(`Failed to delete: ${t.error}`,"error")}async manageGroup(e){const i=(this.getCached(N.GROUPS.key)||[]).find(l=>l.id===e);if(!i){this.showToast("Group not found","error");return}this.showLoading("Loading group details...");const[a,r]=await Promise.all([E.getGroupMembers(e),E.getGroupOwners(e)]);this.hideLoading();const s=a.success?a.members:[],n=r.success?r.owners:[],c=`
            <div class="modal-header">
                <h2 class="modal-title">Manage Group: ${this.escapeHtml(i.displayName)}</h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body modal-lg">
                <div class="tabs">
                    <button class="tab-btn active" onclick="app.pages.groups.switchTab('members')">
                        Members (${s.length})
                    </button>
                    <button class="tab-btn" onclick="app.pages.groups.switchTab('owners')">
                        Owners (${n.length})
                    </button>
                </div>

                <div id="tab-members" class="tab-content active">
                    <div class="tab-header">
                        <button class="btn btn-sm btn-primary" onclick="app.pages.groups.addMember('${e}')">
                            <i class="fas fa-plus"></i> Add Member
                        </button>
                    </div>
                    ${this.renderMembersList(s,e,"member")}
                </div>

                <div id="tab-owners" class="tab-content" style="display: none;">
                    <div class="tab-header">
                        <button class="btn btn-sm btn-primary" onclick="app.pages.groups.addOwner('${e}')">
                            <i class="fas fa-plus"></i> Add Owner
                        </button>
                    </div>
                    ${this.renderMembersList(n,e,"owner")}
                </div>
            </div>
        `;this.showModal(c)}renderMembersList(e,t,i){return e.length===0?`<p class="empty-state">No ${i}s</p>`:`
            <ul class="member-list">
                ${e.map(a=>`
                    <li class="member-item">
                        <div class="member-info">
                            <strong>${this.escapeHtml(a.displayName||a.userPrincipalName)}</strong>
                            <small>${this.escapeHtml(a.userPrincipalName||a.mail||"")}</small>
                        </div>
                        <button class="btn btn-sm btn-danger"
                                onclick="app.pages.groups.removeMember('${t}', '${a.id}', '${i}', '${this.escapeHtml(a.displayName||a.userPrincipalName)}')"
                                aria-label="Remove ${i}">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </li>
                `).join("")}
            </ul>
        `}switchTab(e){var i;document.querySelectorAll(".tab-btn").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(a=>{a.style.display="none",a.classList.remove("active")}),(i=document.querySelector(`.tab-btn[onclick*="${e}"]`))==null||i.classList.add("active");const t=document.getElementById(`tab-${e}`);t&&(t.style.display="block",t.classList.add("active"))}async addMember(e){this.showToast("Add member functionality - coming soon","info")}async addOwner(e){this.showToast("Add owner functionality - coming soon","info")}removeMember(e,t,i,a="this user"){const r=pt.renderConfirmDialog({title:`Remove ${i.charAt(0).toUpperCase()+i.slice(1)}`,message:`Are you sure you want to remove "${a}" as a ${i}? They will lose access to this group's roles.`,confirmLabel:`Remove ${i.charAt(0).toUpperCase()+i.slice(1)}`,confirmVariant:"btn-danger",icon:"fa-user-minus",iconColor:"warning",onConfirm:`app.pages.groups.confirmRemoveMember('${e}', '${t}', '${i}')`});this.showModal(r)}async confirmRemoveMember(e,t,i){this.closeModal(),this.showLoading(`Removing ${i}...`);const a=i==="member"?await E.removeGroupMember(e,t):await E.removeGroupOwner(e,t);this.hideLoading(),a.success?(this.showToast(`${i.charAt(0).toUpperCase()+i.slice(1)} removed successfully`,"success"),this.manageGroup(e)):this.showToast(`Failed to remove ${i}: ${a.error}`,"error")}toggleItem(e){this.bulkOps.toggleItem(e)}toggleAll(e){e.checked?this.bulkOps.selectAll():this.bulkOps.clearSelection()}bulkDeleteGroups(){const e=this.bulkOps.getSelectedItems();if(e.length===0){this.showToast("No groups selected","warning");return}const t=pt.renderConfirmDialog({title:"Delete Multiple Groups",message:`You are about to delete ${e.length} group${e.length===1?"":"s"}. This action cannot be undone. Are you sure?`,confirmLabel:`Delete ${e.length} Group${e.length===1?"":"s"}`,confirmVariant:"btn-danger",icon:"fa-trash",iconColor:"error",onConfirm:"app.pages.groups.confirmBulkDeleteGroups()"});this.showModal(t)}async confirmBulkDeleteGroups(){this.closeModal();const e=this.bulkOps.getSelectedItems();this.showModal(La({current:0,total:e.length,percentage:0})),await ml(e,async t=>{const i=await E.deleteGroup(t.id);if(!i.success)throw new Error(i.error)},t=>{const i=document.querySelector(".modal-body");i&&(i.innerHTML=La(t))},t=>{this.showModal(fl(t)),t.succeeded>0&&this.refreshPage(),this.bulkOps.clearSelection()})}bulkExportGroups(){const e=this.bulkOps.getSelectedItems();if(e.length===0){this.showToast("No groups selected","warning");return}this.app.exportUtils.exportGroups(e),this.showToast(`Exported ${e.length} group${e.length===1?"":"s"}`,"success")}}class Al extends V{constructor(e){super(e),this.paginator=e.paginators.roles,this.roleSortOrder="privilege-desc",this.filters={search:"",privilege:"all",type:"all"}}async render(e,t={}){let i=[];if(this.isConnected()){if(this.showLoading("Loading roles..."),i=this.getCached(N.ROLES.key),!i){const s=await E.getRoleDefinitions();s.success?(i=s.roles,this.setCached(N.ROLES.key,i)):this.showToast(`Failed to load roles: ${s.error}`,"error")}this.hideLoading()}i=i||[],i=this.sortRolesByPrivilege(i,this.roleSortOrder),this.paginator.updateItems(i);const a=this.paginator.getCurrentPageItems(),r=s=>{const n={critical:{class:"badge-critical",icon:"fa-skull-crossbones",label:"Critical"},high:{class:"badge-high",icon:"fa-exclamation-triangle",label:"High"},medium:{class:"badge-medium",icon:"fa-shield-alt",label:"Medium"},low:{class:"badge-low",icon:"fa-check-circle",label:"Low"}},c=n[s]||n.low;return`<span class="badge privilege-badge ${c.class}"><i class="fas ${c.icon}"></i> ${c.label}</span>`};e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">Entra ID Roles</h1>
            </div>

            <div class="toolbar">
                <input type="text" id="role-search" class="input" placeholder="Search roles..."
                       value="${this.filters.search}"
                       oninput="app.pages.roles.updateFilter('search', this.value)">

                <select id="privilege-filter" class="input input-select"
                        onchange="app.pages.roles.updateFilter('privilege', this.value)">
                    <option value="all" ${this.filters.privilege==="all"?"selected":""}>All Privileges</option>
                    <option value="critical" ${this.filters.privilege==="critical"?"selected":""}>Critical Only</option>
                    <option value="high" ${this.filters.privilege==="high"?"selected":""}>High Only</option>
                    <option value="medium" ${this.filters.privilege==="medium"?"selected":""}>Medium Only</option>
                    <option value="low" ${this.filters.privilege==="low"?"selected":""}>Low Only</option>
                </select>

                <select id="type-filter" class="input input-select"
                        onchange="app.pages.roles.updateFilter('type', this.value)">
                    <option value="all" ${this.filters.type==="all"?"selected":""}>All Types</option>
                    <option value="builtin" ${this.filters.type==="builtin"?"selected":""}>Built-in Only</option>
                    <option value="custom" ${this.filters.type==="custom"?"selected":""}>Custom Only</option>
                </select>

                <select id="role-sort" class="input input-select" onchange="app.pages.roles.sortRoles(this.value)">
                    <option value="privilege-desc" ${this.roleSortOrder==="privilege-desc"?"selected":""}>Privilege: High to Low</option>
                    <option value="privilege-asc" ${this.roleSortOrder==="privilege-asc"?"selected":""}>Privilege: Low to High</option>
                    <option value="name-asc" ${this.roleSortOrder==="name-asc"?"selected":""}>Name: A to Z</option>
                    <option value="name-desc" ${this.roleSortOrder==="name-desc"?"selected":""}>Name: Z to A</option>
                </select>

                ${this.filters.search||this.filters.privilege!=="all"||this.filters.type!=="all"?`
                    <button class="btn btn-secondary" onclick="app.pages.roles.clearFilters()" title="Clear all filters">
                        <i class="fas fa-times"></i> Clear Filters
                    </button>
                `:""}

                <button class="btn btn-secondary" onclick="app.showExportMenu('roles')" ${!this.isConnected()||i.length===0?"disabled":""}>
                    <i class="fas fa-file-export"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="app.pages.roles.refreshPage()" ${this.isConnected()?"":"disabled"}>
                    <i class="fas fa-sync"></i> Refresh
                </button>
            </div>

            <div class="card">
                <table class="data-table" id="roles-table">
                    <thead>
                        <tr>
                            <th class="sortable" onclick="app.pages.roles.sortRoles('name')">Role Name <i class="fas fa-sort"></i></th>
                            <th>Description</th>
                            <th class="sortable" onclick="app.pages.roles.sortRoles('privilege')">Privilege <i class="fas fa-sort"></i></th>
                            <th>Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${a.length>0?a.map(s=>`
                            <tr data-id="${s.id}" data-privilege="${s.privilegeLevel}">
                                <td><strong>${this.escapeHtml(s.displayName)}</strong></td>
                                <td class="description-cell">${this.escapeHtml((s.description||"").substring(0,80))}${(s.description||"").length>80?"...":""}</td>
                                <td>${r(s.privilegeLevel)}</td>
                                <td>${s.isBuiltIn?'<span class="badge">Built-in</span>':'<span class="badge badge-secondary">Custom</span>'}</td>
                                <td>
                                    <button class="icon-btn" onclick="app.pages.roles.assignGroupToRole('${s.id}', '${this.escapeHtml(s.displayName)}')" title="Assign Group" aria-label="Assign group to ${this.escapeHtml(s.displayName)}">
                                        <i class="fas fa-user-plus" aria-hidden="true"></i>
                                    </button>
                                    <button class="icon-btn" onclick="app.pages.roles.configureRolePolicy('${s.id}')" title="Configure Policy" aria-label="Configure policy for ${this.escapeHtml(s.displayName)}">
                                        <i class="fas fa-cog" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join(""):`
                            <tr>
                                <td colspan="5" class="empty-state">
                                    ${this.isConnected()?"No roles found":"Connect to view roles"}
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>

                ${this.paginator.renderControls("app.pages.roles.handlePageChange")}
            </div>

            <div class="privilege-legend">
                <span class="legend-title">Privilege Levels:</span>
                <span class="badge privilege-badge badge-critical"><i class="fas fa-skull-crossbones"></i> Critical</span>
                <span class="badge privilege-badge badge-high"><i class="fas fa-exclamation-triangle"></i> High</span>
                <span class="badge privilege-badge badge-medium"><i class="fas fa-shield-alt"></i> Medium</span>
                <span class="badge privilege-badge badge-low"><i class="fas fa-check-circle"></i> Low</span>
            </div>
        `}sortRolesByPrivilege(e,t){const i={critical:0,high:1,medium:2,low:3};return[...e].sort((a,r)=>t==="privilege-desc"?i[a.privilegeLevel]-i[r.privilegeLevel]:t==="privilege-asc"?i[r.privilegeLevel]-i[a.privilegeLevel]:t==="name-asc"?a.displayName.localeCompare(r.displayName):t==="name-desc"?r.displayName.localeCompare(a.displayName):0)}sortRoles(e){e==="privilege"?e=this.roleSortOrder==="privilege-desc"?"privilege-asc":"privilege-desc":e==="name"&&(e=this.roleSortOrder==="name-asc"?"name-desc":"name-asc"),this.roleSortOrder=e,this.app.router.refreshCurrentPage()}updateFilter(e,t){this.filters[e]=t,this.applyFilters()}applyFilters(){document.querySelectorAll("#roles-table tbody tr").forEach(t=>{var l;const i=t.textContent.toLowerCase(),a=t.dataset.privilege,r=((l=t.querySelector(".badge:not(.privilege-badge)"))==null?void 0:l.textContent.trim())==="Built-in",s=!this.filters.search||i.includes(this.filters.search.toLowerCase()),n=this.filters.privilege==="all"||a===this.filters.privilege,c=this.filters.type==="all"||this.filters.type==="builtin"&&r||this.filters.type==="custom"&&!r;t.style.display=s&&n&&c?"":"none"}),this.updateFilterCount()}updateFilterCount(){const e=document.querySelectorAll("#roles-table tbody tr"),t=Array.from(e).filter(a=>a.style.display!=="none").length,i=e.length;if(this.filters.search||this.filters.privilege!=="all"||this.filters.type!=="all"){const a=document.querySelector(".page-header");a&&(a.innerHTML=`Entra ID Roles <span class="badge badge-secondary">${t} of ${i}</span>`)}}clearFilters(){this.filters={search:"",privilege:"all",type:"all"},this.app.router.refreshCurrentPage()}handlePageChange(e){this.paginator.goToPage(e),this.app.router.refreshCurrentPage()}handlePageSizeChange(e){this.paginator.setPageSize(e),this.app.router.refreshCurrentPage()}async refreshPage(){this.app.cacheManager.invalidate(N.ROLES.key),await this.app.router.refreshCurrentPage()}async configureRolePolicy(e){var n,c;const i=(this.getCached(N.ROLES.key)||[]).find(l=>l.id===e);if(!i){this.showToast("Role not found","error");return}this.showLoading("Loading policy settings...");const a=await E.getRolePolicy(e);if(this.hideLoading(),!a.success){this.showToast(`Failed to load policy: ${a.error}`,"error");return}const r=a.policy||{},s=`
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-shield-alt"></i> Configure Policy: ${this.escapeHtml(i.displayName)}
                </h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body modal-lg">
                <form id="policy-form">
                    <div class="tabs">
                        <button type="button" class="tab-btn active" onclick="app.pages.roles.switchPolicyTab('activation')">
                            <i class="fas fa-play-circle"></i> Activation
                        </button>
                        <button type="button" class="tab-btn" onclick="app.pages.roles.switchPolicyTab('assignment')">
                            <i class="fas fa-user-plus"></i> Assignment
                        </button>
                        <button type="button" class="tab-btn" onclick="app.pages.roles.switchPolicyTab('notifications')">
                            <i class="fas fa-bell"></i> Notifications
                        </button>
                    </div>

                    <div id="tab-activation" class="tab-content active">
                        <h3><i class="fas fa-play-circle"></i> Activation Settings</h3>
                        <p class="form-hint">Controls how users can activate this role</p>

                        <div class="form-section">
                            <label class="form-label">
                                <input type="checkbox" name="requireMfa" ${r.requireMfa?"checked":""}>
                                <strong>Require Multi-Factor Authentication (MFA)</strong>
                                <small class="form-hint">Users must complete MFA challenge to activate</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireApproval" ${r.requireApproval?"checked":""}
                                       onchange="document.getElementById('approvers-section').style.display = this.checked ? 'block' : 'none'">
                                <strong>Require Approval</strong>
                                <small class="form-hint">Activation request must be approved by designated approvers</small>
                            </label>

                            <div id="approvers-section" style="display: ${r.requireApproval?"block":"none"}; margin-left: 2rem;">
                                <label class="form-label">
                                    Approvers (comma-separated emails)
                                    <textarea name="approvers" class="input" rows="2"
                                              placeholder="admin1@company.com, admin2@company.com">${((n=r.approvers)==null?void 0:n.join(", "))||""}</textarea>
                                    <small class="form-hint">Leave empty to use default approvers</small>
                                </label>
                            </div>

                            <label class="form-label">
                                <input type="checkbox" name="requireJustification" ${r.requireJustification?"checked":""}>
                                <strong>Require Justification</strong>
                                <small class="form-hint">Users must provide business justification for activation</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireTicket" ${r.requireTicket?"checked":""}>
                                <strong>Require Ticket Number</strong>
                                <small class="form-hint">Users must provide change management ticket reference</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Activation Duration</h4>
                            <label class="form-label">
                                Maximum Duration (hours)
                                <div style="display: flex; gap: 0.5rem; align-items: center;">
                                    <input type="number" name="maximumDurationHours" class="input" min="0.5" max="24" step="0.5"
                                           value="${r.maximumDurationHours||8}" style="flex: 1;">
                                    <div class="duration-presets">
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 1">1h</button>
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 4">4h</button>
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 8">8h</button>
                                        <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=maximumDurationHours]').value = 24">24h</button>
                                    </div>
                                </div>
                                <small class="form-hint">Maximum time the role can be active (0.5 to 24 hours)</small>
                            </label>

                            <label class="form-label">
                                Default Duration (hours)
                                <input type="number" name="defaultDurationHours" class="input" min="0.5" max="24" step="0.5"
                                       value="${r.defaultDurationHours||4}">
                                <small class="form-hint">Pre-filled duration when activating</small>
                            </label>
                        </div>
                    </div>

                    <div id="tab-assignment" class="tab-content" style="display: none;">
                        <h3><i class="fas fa-user-plus"></i> Assignment Settings</h3>
                        <p class="form-hint">Controls how users can be assigned as eligible for this role</p>

                        <div class="form-section">
                            <label class="form-label">
                                <input type="checkbox" name="allowPermanentEligible" ${r.allowPermanentEligible!==!1?"checked":""}>
                                <strong>Allow Permanent Eligible Assignments</strong>
                                <small class="form-hint">Administrators can assign users as permanently eligible</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="requireJustificationOnAssignment" ${r.requireJustificationOnAssignment?"checked":""}>
                                <strong>Require Justification for Assignment</strong>
                                <small class="form-hint">Administrators must justify when making users eligible</small>
                            </label>

                            <label class="form-label">
                                Maximum Eligible Assignment Duration (days)
                                <input type="number" name="maxEligibleDurationDays" class="input" min="1" max="365"
                                       value="${r.maxEligibleDurationDays||365}">
                                <small class="form-hint">Maximum time-bound eligible assignment (1-365 days, 0 = no limit)</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Active Assignment Settings</h4>
                            <label class="form-label">
                                <input type="checkbox" name="allowPermanentActive" ${r.allowPermanentActive?"checked":""}>
                                <strong>Allow Permanent Active Assignments</strong>
                                <small class="form-hint warning-text">⚠️ Not recommended for PIM - bypasses activation requirements</small>
                            </label>

                            <label class="form-label">
                                Maximum Active Assignment Duration (days)
                                <input type="number" name="maxActiveDurationDays" class="input" min="1" max="365"
                                       value="${r.maxActiveDurationDays||180}">
                                <small class="form-hint">Maximum time-bound active assignment (1-365 days)</small>
                            </label>
                        </div>
                    </div>

                    <div id="tab-notifications" class="tab-content" style="display: none;">
                        <h3><i class="fas fa-bell"></i> Notification Settings</h3>
                        <p class="form-hint">Configure who gets notified and when</p>

                        <div class="form-section">
                            <h4>Activation Notifications</h4>
                            <label class="form-label">
                                <input type="checkbox" name="notifyOnActivation" ${r.notifyOnActivation!==!1?"checked":""}>
                                <strong>Notify on Role Activation</strong>
                                <small class="form-hint">Send notification when role is activated</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="notifyOnExpiration" ${r.notifyOnExpiration!==!1?"checked":""}>
                                <strong>Notify Before Expiration</strong>
                                <small class="form-hint">Send reminder before activation expires</small>
                            </label>

                            <label class="form-label">
                                Expiration Warning (hours before)
                                <input type="number" name="expirationWarningHours" class="input" min="0.5" max="24" step="0.5"
                                       value="${r.expirationWarningHours||1}">
                                <small class="form-hint">How early to send expiration warning</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Assignment Notifications</h4>
                            <label class="form-label">
                                <input type="checkbox" name="notifyOnEligibleAssignment" ${r.notifyOnEligibleAssignment!==!1?"checked":""}>
                                <strong>Notify on Eligible Assignment</strong>
                                <small class="form-hint">Notify user when made eligible for role</small>
                            </label>

                            <label class="form-label">
                                <input type="checkbox" name="notifyAdminsOnAssignment" ${r.notifyAdminsOnAssignment?"checked":""}>
                                <strong>Notify Admins on Assignment</strong>
                                <small class="form-hint">Send notification to admins when eligibility changes</small>
                            </label>
                        </div>

                        <div class="form-section">
                            <h4>Additional Recipients</h4>
                            <label class="form-label">
                                Additional Notification Recipients (comma-separated emails)
                                <textarea name="additionalRecipients" class="input" rows="2"
                                          placeholder="security@company.com, audit@company.com">${((c=r.additionalRecipients)==null?void 0:c.join(", "))||""}</textarea>
                                <small class="form-hint">These recipients will receive all notifications for this role</small>
                            </label>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="button" class="btn btn-secondary" onclick="app.pages.roles.resetPolicyToDefaults('${e}')">
                            <i class="fas fa-undo"></i> Reset to Defaults
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Policy
                        </button>
                    </div>
                </form>
            </div>
        `;this.showModal(s),document.getElementById("policy-form").addEventListener("submit",async l=>{l.preventDefault(),await this.handleSavePolicy(e,l.target)})}switchPolicyTab(e){var i;document.querySelectorAll(".tab-btn").forEach(a=>a.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(a=>{a.style.display="none",a.classList.remove("active")}),(i=document.querySelector(`.tab-btn[onclick*="${e}"]`))==null||i.classList.add("active");const t=document.getElementById(`tab-${e}`);t&&(t.style.display="block",t.classList.add("active"))}resetPolicyToDefaults(e){if(!confirm("Reset this policy to default settings? Your custom configuration will be lost."))return;const t=document.getElementById("policy-form");t&&(t.reset(),t.querySelector('[name="maximumDurationHours"]').value=8,t.querySelector('[name="defaultDurationHours"]').value=4,t.querySelector('[name="maxEligibleDurationDays"]').value=365,t.querySelector('[name="maxActiveDurationDays"]').value=180,t.querySelector('[name="expirationWarningHours"]').value=1,t.querySelector('[name="notifyOnActivation"]').checked=!0,t.querySelector('[name="notifyOnExpiration"]').checked=!0,t.querySelector('[name="notifyOnEligibleAssignment"]').checked=!0,t.querySelector('[name="allowPermanentEligible"]').checked=!0,document.getElementById("approvers-section").style.display="none",this.showToast("Policy reset to defaults","info"))}async handleSavePolicy(e,t){const i=new FormData(t),a=n=>n?n.split(",").map(c=>c.trim()).filter(c=>c.length>0):[],r={requireMfa:i.get("requireMfa")==="on",requireApproval:i.get("requireApproval")==="on",requireJustification:i.get("requireJustification")==="on",requireTicket:i.get("requireTicket")==="on",maximumDurationHours:parseFloat(i.get("maximumDurationHours"))||8,defaultDurationHours:parseFloat(i.get("defaultDurationHours"))||4,approvers:a(i.get("approvers")),allowPermanentEligible:i.get("allowPermanentEligible")==="on",requireJustificationOnAssignment:i.get("requireJustificationOnAssignment")==="on",maxEligibleDurationDays:parseInt(i.get("maxEligibleDurationDays"))||365,allowPermanentActive:i.get("allowPermanentActive")==="on",maxActiveDurationDays:parseInt(i.get("maxActiveDurationDays"))||180,notifyOnActivation:i.get("notifyOnActivation")==="on",notifyOnExpiration:i.get("notifyOnExpiration")==="on",expirationWarningHours:parseFloat(i.get("expirationWarningHours"))||1,notifyOnEligibleAssignment:i.get("notifyOnEligibleAssignment")==="on",notifyAdminsOnAssignment:i.get("notifyAdminsOnAssignment")==="on",additionalRecipients:a(i.get("additionalRecipients"))};if(r.defaultDurationHours>r.maximumDurationHours){this.showToast("Default duration cannot exceed maximum duration","error");return}if(r.requireApproval&&r.approvers.length===0&&!confirm("No approvers specified. Continue with default approvers?")||r.allowPermanentActive&&!confirm("⚠️ Permanent active assignments bypass PIM protections. Are you sure?"))return;this.closeModal(),this.showLoading("Updating policy...");const s=await E.updateRolePolicy(e,r);this.hideLoading(),s.success?this.showToast("Policy updated successfully","success"):this.showToast(`Failed to update policy: ${s.error}`,"error")}async assignGroupToRole(e,t){this.showLoading("Loading groups...");const i=await E.getPIMGroups();if(this.hideLoading(),!i.success||!i.groups||i.groups.length===0){this.showToast("No PIM groups available to assign","error");return}const a=i.groups,r=`
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-user-plus"></i> Assign Group to Role
                </h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close" aria-label="Close dialog">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body">
                <div style="margin-bottom: var(--space-lg);">
                    <h3>${this.escapeHtml(t)}</h3>
                    <p class="text-muted">Assign a PIM group to this role</p>
                </div>

                <form id="assign-group-form">
                    <div class="form-section">
                        <label class="form-label">
                            <strong>Select Group <span class="required">*</span></strong>
                            <select name="groupId" class="input" required>
                                <option value="">-- Select a group --</option>
                                ${a.map(s=>`
                                    <option value="${s.id}">${this.escapeHtml(s.displayName)} (${s.memberCount} members)</option>
                                `).join("")}
                            </select>
                            <small class="form-hint">Choose which PIM group to assign to this role</small>
                        </label>
                    </div>

                    <div class="form-section">
                        <label class="form-label">
                            <strong>Assignment Type <span class="required">*</span></strong>
                            <select name="assignmentType" class="input" onchange="
                                const value = this.value;
                                const isPermanent = value.includes('permanent');
                                document.getElementById('duration-section').style.display = isPermanent ? 'none' : 'block';

                                // Update description
                                const descriptions = {
                                    'eligible-permanent': 'Group members can activate this role (no expiration)',
                                    'eligible-timebound': 'Group members can activate this role (expires after duration)',
                                    'active-permanent': '⚠️ Group members are ALWAYS active in this role (bypasses PIM)',
                                    'active-timebound': 'Group members are active in this role until expiration'
                                };
                                document.getElementById('assignment-type-hint').textContent = descriptions[value] || '';
                            " required>
                                <optgroup label="Eligible Assignments (Recommended)">
                                    <option value="eligible-permanent">Permanent Eligible (Recommended)</option>
                                    <option value="eligible-timebound">Time-Bound Eligible</option>
                                </optgroup>
                                <optgroup label="Active Assignments">
                                    <option value="active-permanent">Permanent Active (⚠️ Not Recommended)</option>
                                    <option value="active-timebound">Time-Bound Active</option>
                                </optgroup>
                            </select>
                            <small class="form-hint" id="assignment-type-hint">
                                Group members can activate this role (no expiration)
                            </small>
                        </label>
                    </div>

                    <div id="duration-section" style="display: none;">
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Duration (days)</strong>
                                <input type="number" name="durationDays" class="input" min="1" max="365" value="365" step="1">
                                <small class="form-hint">How many days should this assignment last? (1-365 days)</small>
                            </label>
                        </div>
                    </div>

                    <div class="form-section">
                        <label class="form-label">
                            <strong>Justification</strong>
                            <textarea name="justification" class="input" rows="3"
                                      placeholder="Explain why this group needs access to this role..."></textarea>
                            <small class="form-hint">Provide business justification for this assignment</small>
                        </label>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-check"></i> Assign Group
                        </button>
                    </div>
                </form>
            </div>
        `;this.showModal(r),document.getElementById("assign-group-form").addEventListener("submit",async s=>{s.preventDefault(),await this.handleAssignGroup(e,t,s.target)})}async handleAssignGroup(e,t,i){var P;const a=new FormData(i),r=a.get("groupId"),s=a.get("assignmentType"),n=parseInt(a.get("durationDays"))||365,c=a.get("justification")||`PIM assignment to ${t}`;if(!r){this.showToast("Please select a group","error");return}const[l,d]=s.split("-"),u=l==="active",p=d==="permanent";if(u&&!confirm(`⚠️ WARNING: Active assignments bypass PIM protections!

Group members will have IMMEDIATE access to this role without needing to activate.

This is NOT recommended for privileged roles. Consider using Eligible assignments instead.

Continue with Active assignment?`))return;const m=(P=(await E.getPIMGroups()).groups)==null?void 0:P.find(he=>he.id===r),v=(m==null?void 0:m.displayName)||"Unknown Group";this.closeModal(),this.showLoading(`Assigning ${v} to ${t}...`);const w=new Date().toISOString(),C=p?null:new Date(Date.now()+n*24*60*60*1e3).toISOString();let T;if(u?T=await E.createDirectoryRoleActiveAssignment(r,e,c,w,C):T=await E.createDirectoryRoleEligibleAssignment(r,e,c,w,C),this.hideLoading(),T.success){const he=u?"Active":"Eligible",xe=p?"permanently":`for ${n} days`;this.showToast(`Successfully assigned "${v}" as ${he} to "${t}" ${xe}`,"success")}else this.showToast(`Failed to assign group: ${T.error}`,"error")}}class Tl extends V{constructor(e){super(e),this.paginator=e.paginators.activity}async render(e,t={}){let i=[];if(this.isConnected()){this.showLoading("Loading PIM activity...");const n=await E.getPIMAuditLogs(30);n.success?i=n.logs:this.showToast(`Failed to load activity: ${n.error}`,"error"),this.hideLoading()}this.paginator.updateItems(i);const a=this.paginator.getCurrentPageItems(),r=n=>n?new Date(n).toLocaleString():"N/A",s=n=>n!=null&&n.includes("Add")||n!=null&&n.includes("Create")?"fa-plus success":n!=null&&n.includes("Remove")||n!=null&&n.includes("Delete")?"fa-trash danger":n!=null&&n.includes("Update")?"fa-edit warning":n!=null&&n.includes("Assign")?"fa-user-check primary":"fa-circle info";e.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(80px); animation: float 10s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 0, 128, 0.05); border: 1px solid var(--accent-secondary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-database" style="color: var(--accent-secondary); font-size: 0.7rem;"></i>
                        <span style="color: var(--accent-secondary); font-weight: 600;">AUDIT TRAIL</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">30 DAY HISTORY</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-secondary), #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 0, 128, 0.3));">
                            ACTIVITY
                        </span>
                        <span style="color: var(--text-primary);"> LOG</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Complete audit trail of privileged role management events
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                <div style="position: absolute; top: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-history" style="color: var(--accent-secondary); font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Event Stream
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${i.length} recorded events
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: var(--space-sm);">
                            <button class="btn btn-secondary btn-sm" onclick="app.showExportMenu('activity')" ${!this.isConnected()||i.length===0?"disabled":""} style="font-family: var(--font-mono);">
                                <i class="fas fa-file-export"></i> EXPORT
                            </button>
                            <button class="btn btn-secondary btn-sm" onclick="app.pages.activity.refreshPage()" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono);">
                                <i class="fas fa-sync"></i> REFRESH
                            </button>
                        </div>
                    </div>

                    <div style="overflow-x: auto;">
                        ${a.length>0?`
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="width: 40px; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;"></th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Activity</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Initiated By</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Target</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Timestamp</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${a.map((n,c)=>{var l,d,u,p,h;return`
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${c%2===0?"rgba(255, 0, 128, 0.02)":"transparent"};">
                                            <td>
                                                <div style="width: 28px; height: 28px; border-radius: 50%; background: rgba(255, 0, 128, 0.1); display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas ${s(n.activityDisplayName).split(" ")[0]}" style="font-size: 0.75rem; color: var(--accent-secondary);"></i>
                                                </div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; color: var(--text-primary);">${this.escapeHtml(n.activityDisplayName||"Unknown Activity")}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${this.escapeHtml(n.category||"N/A")}</div>
                                            </td>
                                            <td>
                                                <div style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">${this.escapeHtml(((d=(l=n.initiatedBy)==null?void 0:l.user)==null?void 0:d.displayName)||"System")}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${this.escapeHtml(((p=(u=n.initiatedBy)==null?void 0:u.user)==null?void 0:p.userPrincipalName)||"N/A")}</div>
                                            </td>
                                            <td>
                                                ${((h=n.targetResources)==null?void 0:h.map(m=>`
                                                    <div style="font-size: 0.85rem; color: var(--text-secondary);">${this.escapeHtml(m.displayName||m.id||"N/A")}</div>
                                                `).join(""))||'<span style="color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">N/A</span>'}
                                            </td>
                                            <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                                                ${r(n.activityDateTime)}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${n.result==="success"?"var(--color-success-dim)":"var(--color-error-dim)"}; color: ${n.result==="success"?"var(--color-success)":"var(--color-error)"}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">
                                                    ${n.result==="success"?"✓ SUCCESS":"✗ FAILED"}
                                                </span>
                                            </td>
                                        </tr>
                                    `}).join("")}
                                </tbody>
                            </table>
                        `:`
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-history" style="font-size: 3.5rem; color: var(--accent-secondary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    No Activity Detected
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected()?"No audit logs found in the last 30 days":"Connect to Microsoft Entra ID to view activity logs"}
                                </div>
                            </div>
                        `}
                    </div>

                    ${this.paginator.renderControls("app.pages.activity.handlePageChange")}
                </div>
            </div>
        `}handlePageChange(e){this.paginator.goToPage(e),this.app.router.refreshCurrentPage()}handlePageSizeChange(e){this.paginator.setPageSize(e),this.app.router.refreshCurrentPage()}async refreshPage(){await this.app.router.refreshCurrentPage()}}class Il extends V{constructor(e){super(e)}async render(e,t={}){let i=[],a=0;if(this.isConnected()){this.showLoading("Loading pending approvals...");const s=this.getCached(N.APPROVALS.key);if(s)i=s.requests||[],a=s.count||0;else{const n=await E.getPendingApprovals();n.success?(i=n.requests,a=n.count,this.setCached(N.APPROVALS.key,{requests:i,count:a})):this.showToast(`Failed to load approvals: ${n.error}`,"error")}this.hideLoading()}const r=s=>s?new Date(s).toLocaleString():"N/A";e.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; left: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--color-warning-dim), transparent); filter: blur(80px); animation: float 12s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 170, 0, 0.05); border: 1px solid var(--color-warning); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-bell" style="color: var(--color-warning); font-size: 0.7rem;"></i>
                        <span style="color: var(--color-warning); font-weight: 600;">APPROVAL QUEUE</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">${a} PENDING</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--color-warning), #ffdd00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 170, 0, 0.3));">
                            PENDING
                        </span>
                        <span style="color: var(--text-primary);"> APPROVALS</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Review and authorize privileged role activation requests
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${a>0?"var(--color-warning)":"var(--border-subtle)"};">
                <div style="position: absolute; top: 0; left: 0; width: 400px; height: 400px; background: radial-gradient(circle, ${a>0?"rgba(255, 170, 0, 0.05)":"var(--accent-primary-dim)"}, transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: ${a>0?"var(--color-warning-dim)":"var(--accent-primary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-clock" style="color: ${a>0?"var(--color-warning)":"var(--accent-primary)"}; font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Approval Queue
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${a} requests awaiting review
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="app.pages.approvals.refreshPage()" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono);" aria-label="Refresh approvals">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                    </div>

                    <div style="padding: var(--space-md);">
                        ${i.length>0?i.map((s,n)=>{var c,l,d,u,p,h;return`
                            <div style="background: rgba(255, 170, 0, 0.05); border: 1px solid var(--color-warning); border-radius: var(--radius-lg); padding: var(--space-lg); margin-bottom: var(--space-md); position: relative; overflow: hidden;" role="article" aria-label="Approval request from ${this.escapeHtml(((c=s.principal)==null?void 0:c.displayName)||"Unknown User")}">
                                <div style="position: absolute; top: 0; right: 0; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 170, 0, 0.1), transparent); filter: blur(40px); pointer-events: none;"></div>
                                <div style="position: relative; z-index: 1;">
                                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--space-lg); margin-bottom: var(--space-lg);">
                                        <div style="flex: 1;">
                                            <!-- User Info -->
                                            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md);">
                                                <div style="width: 36px; height: 36px; background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                                    <i class="fas fa-user" style="color: var(--accent-primary); font-size: 1rem;"></i>
                                                </div>
                                                <div>
                                                    <div style="font-weight: 700; font-size: 1.1rem; color: var(--text-primary);">
                                                        ${this.escapeHtml(((l=s.principal)==null?void 0:l.displayName)||"Unknown User")}
                                                    </div>
                                                    <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                                                        ${this.escapeHtml(((d=s.principal)==null?void 0:d.userPrincipalName)||"N/A")}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Role -->
                                            <div style="display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); padding: var(--space-sm) var(--space-md); background: rgba(0, 255, 159, 0.05); border-left: 3px solid var(--accent-primary); border-radius: var(--radius-sm);">
                                                <i class="fas fa-shield-check" style="color: var(--accent-primary);"></i>
                                                <div>
                                                    <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 2px;">
                                                        REQUESTING ROLE
                                                    </div>
                                                    <div style="font-weight: 600; color: var(--text-primary);">
                                                        ${this.escapeHtml(((u=s.roleDefinition)==null?void 0:u.displayName)||"Unknown Role")}
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Justification -->
                                            <div style="background: rgba(0, 0, 0, 0.2); padding: var(--space-md); border-radius: var(--radius-sm); margin-bottom: var(--space-md);">
                                                <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: var(--space-xs);">
                                                    <i class="fas fa-comment-dots"></i> JUSTIFICATION
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${this.escapeHtml(s.justification||"No justification provided")}
                                                </div>
                                            </div>

                                            <!-- Timestamp -->
                                            <div style="display: flex; align-items: center; gap: var(--space-xs); font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
                                                <i class="fas fa-clock"></i>
                                                <span>Requested: ${r(s.createdDateTime)}</span>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div style="display: flex; flex-direction: column; gap: var(--space-sm); min-width: 140px;">
                                            <button class="btn btn-success" onclick="app.pages.approvals.reviewApproval('${s.id}', 'approve')" style="width: 100%; font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-md);" aria-label="Approve request from ${this.escapeHtml(((p=s.principal)==null?void 0:p.displayName)||"Unknown User")}">
                                                <i class="fas fa-check-circle"></i> APPROVE
                                            </button>
                                            <button class="btn btn-danger" onclick="app.pages.approvals.reviewApproval('${s.id}', 'deny')" style="width: 100%; font-family: var(--font-mono); font-size: 0.85rem; padding: var(--space-md);" aria-label="Deny request from ${this.escapeHtml(((h=s.principal)==null?void 0:h.displayName)||"Unknown User")}">
                                                <i class="fas fa-times-circle"></i> DENY
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `}).join(""):`
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-check-double" style="font-size: 3.5rem; color: var(--accent-primary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    All Caught Up
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected()?"No pending approval requests in the queue":"Connect to Microsoft Entra ID to view pending approvals"}
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `}async reviewApproval(e,t){const i=prompt(`${t==="approve"?"Approve":"Deny"} this request?

Enter justification:`);if(!i)return;this.showLoading(`${t==="approve"?"Approving":"Denying"} request...`);const a=await E.reviewApprovalRequest(e,t,i);this.hideLoading(),a.success?(this.showToast(`Request ${t==="approve"?"approved":"denied"} successfully`,"success"),this.refreshPage()):this.showToast(a.error,"error")}async refreshPage(){this.app.cacheManager.invalidate(N.APPROVALS.key),await this.app.router.refreshCurrentPage()}}class kl extends V{constructor(e){super(e)}async render(e,t={}){let i=[],a=0;if(this.isConnected()){this.showLoading("Loading expiring assignments...");const n=this.getCached(N.EXPIRING_ASSIGNMENTS.key);if(n)i=n.expiringAssignments||[],a=n.expiringCount||0;else{const c=await E.getRoleAssignmentsWithExpiration();c.success?(i=c.expiringAssignments,a=c.expiringCount,this.setCached(N.EXPIRING_ASSIGNMENTS.key,{expiringAssignments:i,expiringCount:a})):this.showToast(`Failed to load expiring assignments: ${c.error}`,"error")}this.hideLoading()}const r=n=>n?new Date(n).toLocaleString():"N/A",s=n=>{if(!n)return"N/A";const d=new Date(n)-new Date,u=Math.floor(d/(1e3*60*60*24)),p=Math.floor(d%(1e3*60*60*24)/(1e3*60*60));return u>0?`${u}d ${p}h`:p>0?`${p}h`:d>0?"< 1h":"Expired"};e.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(255, 100, 0, 0.1), transparent); filter: blur(80px); animation: float 10s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(255, 100, 0, 0.05); border: 1px solid #ff6400; border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-exclamation-triangle" style="color: #ff6400; font-size: 0.7rem;"></i>
                        <span style="color: #ff6400; font-weight: 600;">TIME SENSITIVE</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">${a} EXPIRING</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, #ff6400, #ff0080); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(255, 100, 0, 0.3));">
                            EXPIRING
                        </span>
                        <span style="color: var(--text-primary);"> ASSIGNMENTS</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Role assignments expiring within 7 days - immediate attention required
                    </p>
                </div>
            </div>

            <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${a>0?"#ff6400":"var(--border-subtle)"};">
                <div style="position: absolute; top: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, ${a>0?"rgba(255, 100, 0, 0.05)":"var(--accent-primary-dim)"}, transparent); filter: blur(100px); pointer-events: none;"></div>

                <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                        <div style="display: flex; align-items: center; gap: var(--space-md);">
                            <div style="width: 48px; height: 48px; background: ${a>0?"rgba(255, 100, 0, 0.1)":"var(--accent-primary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-hourglass-end" style="color: ${a>0?"#ff6400":"var(--accent-primary)"}; font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Expiring Assignments
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    ${a} assignments require renewal
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-secondary btn-sm" onclick="app.pages.expiring.refreshPage()" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono);" aria-label="Refresh expiring assignments">
                            <i class="fas fa-sync"></i> REFRESH
                        </button>
                    </div>

                    <div style="overflow-x: auto;">
                        ${i.length>0?`
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Principal</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Role</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Type</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Expiration Date</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Time Left</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${i.map((n,c)=>{var u,p,h,m;const l=s(n.endDateTime),d=l.includes("h")||l==="Expired";return`
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${c%2===0?"rgba(255, 100, 0, 0.02)":"transparent"};">
                                            <td>
                                                <div style="font-weight: 600; font-size: 0.9rem; margin-bottom: 2px; color: var(--text-primary);">${this.escapeHtml(((u=n.principal)==null?void 0:u.displayName)||"Unknown")}</div>
                                                <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">
                                                    ${this.escapeHtml(((p=n.principal)==null?void 0:p.userPrincipalName)||((h=n.principal)==null?void 0:h.mail)||"N/A")}
                                                </div>
                                            </td>
                                            <td style="font-size: 0.9rem; font-weight: 500; color: var(--text-primary);">
                                                ${this.escapeHtml(((m=n.roleDefinition)==null?void 0:m.displayName)||"Unknown Role")}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${n.type==="active"?"var(--color-success-dim)":"var(--bg-elevated)"}; color: ${n.type==="active"?"var(--color-success)":"var(--text-secondary)"}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase;">
                                                    ${n.type}
                                                </span>
                                            </td>
                                            <td style="white-space: nowrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary);">
                                                ${r(n.endDateTime)}
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${d?"rgba(255, 0, 85, 0.1)":"rgba(255, 100, 0, 0.1)"}; color: ${d?"var(--color-error)":"#ff6400"}; font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: var(--space-xs) var(--space-sm); ${d?"animation: pulse 2s ease-in-out infinite;":""}">
                                                    ${d?"⚠ ":""}${l}
                                                </span>
                                            </td>
                                        </tr>
                                    `}).join("")}
                                </tbody>
                            </table>
                        `:`
                            <div style="text-align: center; padding: var(--space-2xl) var(--space-lg); color: var(--text-secondary);">
                                <div style="width: 120px; height: 120px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-check-circle" style="font-size: 3.5rem; color: var(--accent-primary); opacity: 0.5;"></i>
                                </div>
                                <div style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: var(--space-sm); color: var(--text-primary);">
                                    All Clear
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-muted);">
                                    ${this.isConnected()?"No role assignments expiring within the next 7 days":"Connect to Microsoft Entra ID to monitor expiring assignments"}
                                </div>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `}async refreshPage(){this.app.cacheManager.invalidate(N.EXPIRING_ASSIGNMENTS.key),await this.app.router.refreshCurrentPage()}}class El extends V{constructor(e){super(e)}async render(e,t={}){let i=null;if(this.isConnected()){this.showLoading("Running health check...");const a=this.getCached(N.HEALTH_CHECK.key);if(a)i=a;else{const r=await E.runHealthCheck();r.success?(i=r,this.setCached(N.HEALTH_CHECK.key,i)):this.showToast(`Failed to run health check: ${r.error}`,"error")}this.hideLoading()}e.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; left: -5%; width: 300px; height: 300px; background: radial-gradient(circle, ${(i==null?void 0:i.status)==="healthy"?"var(--accent-primary-dim)":(i==null?void 0:i.status)==="warning"?"var(--color-warning-dim)":"rgba(255, 0, 85, 0.1)"}, transparent); filter: blur(80px); animation: float 15s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: ${(i==null?void 0:i.status)==="healthy"?"rgba(0, 255, 159, 0.05)":(i==null?void 0:i.status)==="warning"?"rgba(255, 170, 0, 0.05)":"rgba(255, 0, 85, 0.05)"}; border: 1px solid ${(i==null?void 0:i.status)==="healthy"?"var(--accent-primary)":(i==null?void 0:i.status)==="warning"?"var(--color-warning)":"var(--color-error)"}; border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-shield-check" style="color: ${(i==null?void 0:i.status)==="healthy"?"var(--accent-primary)":(i==null?void 0:i.status)==="warning"?"var(--color-warning)":"var(--color-error)"}; font-size: 0.7rem;"></i>
                        <span style="color: ${(i==null?void 0:i.status)==="healthy"?"var(--accent-primary)":(i==null?void 0:i.status)==="warning"?"var(--color-warning)":"var(--color-error)"}; font-weight: 600;">SECURITY SCAN</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">${i?i.checksRun+" CHECKS":"READY"}</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, ${(i==null?void 0:i.status)==="healthy"?"var(--accent-primary), #00ffff":(i==null?void 0:i.status)==="warning"?"var(--color-warning), #ffdd00":"var(--color-error), #ff0099"}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px ${(i==null?void 0:i.status)==="healthy"?"rgba(0, 255, 159, 0.3)":(i==null?void 0:i.status)==="warning"?"rgba(255, 170, 0, 0.3)":"rgba(255, 0, 85, 0.3)"});">
                            HEALTH
                        </span>
                        <span style="color: var(--text-primary);"> CHECK</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        Automated security scanner for PIM configuration compliance
                    </p>
                </div>
            </div>

            ${i?`
                <!-- Massive Health Score Card -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 2px solid ${i.status==="healthy"?"var(--accent-primary)":i.status==="warning"?"var(--color-warning)":"var(--color-error)"}; margin-bottom: var(--space-2xl);">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, ${i.status==="healthy"?"var(--accent-primary-dim)":i.status==="warning"?"rgba(255, 170, 0, 0.05)":"rgba(255, 0, 85, 0.05)"}, transparent); filter: blur(60px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; text-align: center; padding: var(--space-2xl);">
                        <!-- Circular Score Display -->
                        <div style="display: inline-flex; align-items: center; justify-content: center; width: 200px; height: 200px; border-radius: 50%; border: 12px solid ${i.status==="healthy"?"var(--accent-primary)":i.status==="warning"?"var(--color-warning)":"var(--color-error)"}; margin-bottom: var(--space-lg); box-shadow: 0 0 60px ${i.status==="healthy"?"rgba(0, 255, 159, 0.4)":i.status==="warning"?"rgba(255, 170, 0, 0.4)":"rgba(255, 0, 85, 0.4)"};">
                            <div>
                                <div style="font-family: var(--font-display); font-size: 4rem; font-weight: 900; line-height: 1; background: linear-gradient(135deg, ${i.status==="healthy"?"var(--accent-primary), #00ffff":i.status==="warning"?"var(--color-warning), #ffdd00":"var(--color-error), #ff0099"}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                    ${i.healthScore}
                                </div>
                                <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.15em;">
                                    %
                                </div>
                            </div>
                        </div>

                        <!-- Status -->
                        <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin: 0 0 var(--space-sm) 0; text-transform: uppercase; letter-spacing: 0.05em; color: ${i.status==="healthy"?"var(--accent-primary)":i.status==="warning"?"var(--color-warning)":"var(--color-error)"};">
                            ${i.status==="healthy"?"✓ HEALTHY":i.status==="warning"?"⚠ WARNING":"✗ CRITICAL"}
                        </h2>
                        <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.9rem; margin-bottom: var(--space-lg);">
                            Based on ${i.checksRun} automated security checks
                        </p>
                        <button class="btn btn-primary" onclick="app.pages['health-check'].refreshPage()" style="font-family: var(--font-mono); padding: var(--space-md) var(--space-xl);" aria-label="Re-run security scan">
                            <i class="fas fa-redo"></i> RE-RUN SCAN
                        </button>
                    </div>
                </div>

                <!-- Issues & Warnings Grid -->
                <div class="dashboard-grid">
                    <!-- Critical Issues -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${i.issues.length>0?"var(--color-error)":"var(--border-subtle)"};">
                        <div style="position: absolute; top: 0; left: 0; width: 300px; height: 300px; background: radial-gradient(circle, ${i.issues.length>0?"rgba(255, 0, 85, 0.05)":"var(--accent-primary-dim)"}, transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: ${i.issues.length>0?"rgba(255, 0, 85, 0.1)":"var(--accent-primary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${i.issues.length>0?"fa-times-circle":"fa-check-circle"}" style="color: ${i.issues.length>0?"var(--color-error)":"var(--accent-primary)"}; font-size: 1.3rem;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                        Critical Issues
                                    </h2>
                                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                        ${i.issues.length} items requiring immediate attention
                                    </div>
                                </div>
                                ${i.issues.length>0?`<span class="badge" style="background: var(--color-error-dim); color: var(--color-error); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700; animation: pulse 2s ease-in-out infinite;" aria-label="${i.issues.length} critical issues">${i.issues.length}</span>`:""}
                            </div>
                            <div style="max-height: 400px; overflow-y: auto; padding: var(--space-md);">
                                ${i.issues.length>0?i.issues.map((a,r)=>`
                                    <div style="background: rgba(255, 0, 85, 0.05); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-times-circle" style="color: var(--color-error); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-error); margin-bottom: var(--space-xs);">
                                                    ${this.escapeHtml(a.category)}
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${this.escapeHtml(a.message)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join(""):`
                                    <div style="text-align: center; padding: var(--space-xl); color: var(--text-secondary);">
                                        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-shield-check" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                        </div>
                                        <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                            No Critical Issues
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
                                            Your PIM configuration is secure
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>

                    <!-- Warnings -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${i.warnings.length>0?"var(--color-warning)":"var(--border-subtle)"};">
                        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, ${i.warnings.length>0?"rgba(255, 170, 0, 0.05)":"var(--accent-secondary-dim)"}, transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: ${i.warnings.length>0?"var(--color-warning-dim)":"var(--accent-secondary-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${i.warnings.length>0?"fa-exclamation-triangle":"fa-check-circle"}" style="color: ${i.warnings.length>0?"var(--color-warning)":"var(--accent-secondary)"}; font-size: 1.3rem;"></i>
                                </div>
                                <div style="flex: 1;">
                                    <h2 style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                        Warnings
                                    </h2>
                                    <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                        ${i.warnings.length} recommendations for improvement
                                    </div>
                                </div>
                                ${i.warnings.length>0?`<span class="badge" style="background: var(--color-warning-dim); color: var(--color-warning); font-family: var(--font-mono); font-size: 0.75rem; font-weight: 700;" aria-label="${i.warnings.length} warnings">${i.warnings.length}</span>`:""}
                            </div>
                            <div style="max-height: 400px; overflow-y: auto; padding: var(--space-md);">
                                ${i.warnings.length>0?i.warnings.map((a,r)=>`
                                    <div style="background: rgba(255, 170, 0, 0.05); border-left: 3px solid var(--color-warning); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-exclamation-triangle" style="color: var(--color-warning); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-warning); margin-bottom: var(--space-xs);">
                                                    ${this.escapeHtml(a.category)}
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem; margin-bottom: var(--space-xs);">
                                                    ${this.escapeHtml(a.message)}
                                                </div>
                                                ${a.groups?`
                                                    <details style="margin-top: var(--space-sm);">
                                                        <summary style="cursor: pointer; color: var(--text-muted); font-size: 0.8rem; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.05em;">► View Details (${a.groups.length})</summary>
                                                        <ul style="margin-top: var(--space-sm); padding-left: var(--space-lg); color: var(--text-secondary); font-size: 0.85rem;">
                                                            ${a.groups.map(s=>`<li style="margin-bottom: var(--space-xs); font-family: var(--font-mono);">${this.escapeHtml(s)}</li>`).join("")}
                                                        </ul>
                                                    </details>
                                                `:""}
                                            </div>
                                        </div>
                                    </div>
                                `).join(""):`
                                    <div style="text-align: center; padding: var(--space-xl); color: var(--text-secondary);">
                                        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--accent-secondary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-thumbs-up" style="font-size: 2.5rem; color: var(--accent-secondary);"></i>
                                        </div>
                                        <div style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                            No Warnings
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted);">
                                            Configuration meets best practices
                                        </div>
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `:`
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary);">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, var(--accent-primary-dim), transparent); filter: blur(80px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; text-align: center; padding: var(--space-2xl);">
                        <div style="width: 150px; height: 150px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 60px rgba(0, 255, 159, 0.3);">
                            <i class="fas fa-heart-pulse" style="font-size: 4.5rem; color: var(--accent-primary);"></i>
                        </div>
                        <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md); text-transform: uppercase; letter-spacing: 0.05em;">
                            <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                SCANNER READY
                            </span>
                        </h2>
                        <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.95rem; margin-bottom: var(--space-xl); max-width: 500px; margin-left: auto; margin-right: auto;">
                            ${this.isConnected()?"Launch automated security analysis to evaluate your PIM configuration against best practices":"Connect to Microsoft Entra ID to run comprehensive security health checks"}
                        </p>
                        <button class="btn btn-primary" onclick="app.pages['health-check'].refreshPage()" ${this.isConnected()?"":"disabled"} style="font-family: var(--font-mono); padding: var(--space-md) var(--space-2xl); font-size: 1.1rem;" aria-label="Initiate security scan">
                            <i class="fas fa-play-circle"></i> INITIATE SCAN
                        </button>
                    </div>
                </div>
            `}
        `}async refreshPage(){this.app.cacheManager.invalidate(N.HEALTH_CHECK.key),await this.app.router.refreshCurrentPage()}}class Sl extends V{constructor(e){super(e)}async render(e,t={}){let i=null;if(this.isConnected()){this.showLoading("Generating coverage report...");const r=this.getCached(N.COVERAGE.key);if(r)i=r;else{const s=await E.getRoleCoverageReport();s.success?(i=s,this.setCached(N.COVERAGE.key,i)):this.showToast(`Failed to generate coverage report: ${s.error}`,"error")}this.hideLoading()}const a=(r,s)=>s===0?0:Math.round(r/s*100);e.innerHTML=`
            <!-- Dramatic Page Header -->
            <div style="position: relative; margin-bottom: var(--space-2xl); overflow: hidden;">
                <div style="position: absolute; top: -50%; right: -5%; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(80px); animation: float 13s ease-in-out infinite; pointer-events: none;"></div>
                <div style="position: relative; z-index: 1;">
                    <div style="display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-xs) var(--space-md); background: rgba(0, 255, 159, 0.05); border: 1px solid var(--accent-primary); border-radius: var(--radius-full); margin-bottom: var(--space-md); font-family: var(--font-mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em;">
                        <i class="fas fa-chart-line" style="color: var(--accent-primary); font-size: 0.7rem;"></i>
                        <span style="color: var(--accent-primary); font-weight: 600;">ANALYTICS</span>
                        <span style="color: var(--text-muted);">|</span>
                        <span style="color: var(--text-secondary);">COVERAGE ANALYSIS</span>
                    </div>
                    <h1 style="font-family: var(--font-display); font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; line-height: 1.1; margin-bottom: var(--space-sm); letter-spacing: -0.03em;">
                        <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 30px rgba(0, 255, 159, 0.3));">
                            ROLE
                        </span>
                        <span style="color: var(--text-primary);"> COVERAGE</span>
                    </h1>
                    <p style="font-size: 0.95rem; color: var(--text-secondary); font-family: var(--font-mono);">
                        PIM group coverage vs direct role assignments analysis
                    </p>
                </div>
            </div>

            ${i?`
                <!-- Summary Cards with Enhanced Design -->
                <div class="stats-grid" style="margin-bottom: var(--space-2xl);">
                    <div class="card stat-card" style="position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-shield-check" style="font-size: 1.5rem; color: var(--accent-primary);"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                ${i.totalRoles}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">TOTAL ROLES</div>
                        </div>
                    </div>

                    <div class="card stat-card" style="position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--color-success-dim), transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: var(--color-success-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-users" style="font-size: 1.5rem; color: var(--color-success);"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                ${i.totalPIMGroups}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">PIM GROUPS</div>
                        </div>
                    </div>

                    <div class="card stat-card" style="position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-check-double" style="font-size: 1.5rem; color: var(--accent-secondary);"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                ${i.coveredRoles}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">COVERED</div>
                        </div>
                    </div>

                    <div class="card stat-card" style="position: relative; overflow: hidden; ${i.directUserAssignmentsCount>0?"border: 1px solid var(--color-warning);":""}">
                        <div style="position: absolute; top: 50%; right: -20%; width: 150px; height: 150px; background: radial-gradient(circle, ${i.directUserAssignmentsCount>0?"var(--color-warning-dim)":"var(--bg-elevated)"}, transparent); filter: blur(40px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="width: 56px; height: 56px; background: ${i.directUserAssignmentsCount>0?"var(--color-warning-dim)":"var(--bg-elevated)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md);">
                                <i class="fas fa-user" style="font-size: 1.5rem; color: ${i.directUserAssignmentsCount>0?"var(--color-warning)":"var(--text-muted)"};"></i>
                            </div>
                            <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; line-height: 1; margin-bottom: var(--space-xs); color: ${i.directUserAssignmentsCount>0?"var(--color-warning)":"var(--text-primary)"};">
                                ${i.directUserAssignmentsCount}
                            </div>
                            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); font-family: var(--font-mono);">DIRECT ONLY</div>
                        </div>
                    </div>
                </div>

                <!-- Coverage Chart & Details -->
                <div class="dashboard-grid">
                    <!-- Coverage Pie Chart -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle);">
                        <div style="position: absolute; top: 0; left: 0; width: 300px; height: 300px; background: radial-gradient(circle, var(--accent-primary-dim), transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: var(--accent-primary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas fa-chart-pie" style="color: var(--accent-primary); font-size: 1.3rem;"></i>
                                </div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Coverage Overview
                                </h2>
                            </div>
                            <div style="padding: var(--space-2xl); text-align: center;">
                                <!-- Pie Chart -->
                                <div style="max-width: 220px; margin: 0 auto var(--space-xl); position: relative;">
                                    <div style="background: conic-gradient(
                                        var(--accent-primary) 0deg ${a(i.coveredRoles,i.totalRoles)*3.6}deg,
                                        var(--color-error) ${a(i.coveredRoles,i.totalRoles)*3.6}deg 360deg
                                    ); width: 220px; height: 220px; border-radius: 50%; box-shadow: 0 0 60px rgba(0, 255, 159, 0.3);"></div>
                                    <!-- Center Circle with Percentage -->
                                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140px; height: 140px; background: var(--bg-base); border-radius: 50%; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 3px solid var(--bg-elevated);">
                                        <div style="font-family: var(--font-display); font-size: 2.5rem; font-weight: 900; line-height: 1; background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                            ${a(i.coveredRoles,i.totalRoles)}
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.15em; margin-top: 4px;">
                                            %
                                        </div>
                                    </div>
                                </div>
                                <!-- Legend -->
                                <div style="display: flex; flex-direction: column; gap: var(--space-md); max-width: 280px; margin: 0 auto;">
                                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) var(--space-md); background: rgba(0, 255, 159, 0.05); border-left: 3px solid var(--accent-primary); border-radius: var(--radius-sm);">
                                        <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                            <div style="width: 14px; height: 14px; background: var(--accent-primary); border-radius: 50%; box-shadow: 0 0 10px rgba(0, 255, 159, 0.5);"></div>
                                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);">Covered</span>
                                        </div>
                                        <span style="font-family: var(--font-display); font-weight: 700; color: var(--accent-primary);">
                                            ${a(i.coveredRoles,i.totalRoles)}%
                                        </span>
                                    </div>
                                    <div style="display: flex; align-items: center; justify-content: space-between; padding: var(--space-sm) var(--space-md); background: rgba(255, 0, 85, 0.05); border-left: 3px solid var(--color-error); border-radius: var(--radius-sm);">
                                        <div style="display: flex; align-items: center; gap: var(--space-sm);">
                                            <div style="width: 14px; height: 14px; background: var(--color-error); border-radius: 50%; box-shadow: 0 0 10px rgba(255, 0, 85, 0.5);"></div>
                                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-primary);">Uncovered</span>
                                        </div>
                                        <span style="font-family: var(--font-display); font-weight: 700; color: var(--color-error);">
                                            ${a(i.uncoveredRoles,i.totalRoles)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Recommendations -->
                    <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid ${i.uncoveredRoles>0||i.directUserAssignmentsCount>0?"var(--color-warning)":"var(--accent-primary)"};">
                        <div style="position: absolute; top: 0; right: 0; width: 300px; height: 300px; background: radial-gradient(circle, ${i.uncoveredRoles>0||i.directUserAssignmentsCount>0?"var(--color-warning-dim)":"var(--accent-primary-dim)"}, transparent); filter: blur(80px); pointer-events: none;"></div>
                        <div style="position: relative; z-index: 1;">
                            <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                                <div style="width: 48px; height: 48px; background: ${i.uncoveredRoles===0&&i.directUserAssignmentsCount===0?"var(--accent-primary-dim)":"var(--color-warning-dim)"}; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                    <i class="fas ${i.uncoveredRoles===0&&i.directUserAssignmentsCount===0?"fa-check-circle":"fa-lightbulb"}" style="color: ${i.uncoveredRoles===0&&i.directUserAssignmentsCount===0?"var(--accent-primary)":"var(--color-warning)"}; font-size: 1.3rem;"></i>
                                </div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Recommendations
                                </h2>
                            </div>
                            <div style="padding: var(--space-md);">
                                ${i.uncoveredRoles>0?`
                                    <div style="background: rgba(255, 170, 0, 0.05); border-left: 3px solid var(--color-warning); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-exclamation-triangle" style="color: var(--color-warning); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-warning); margin-bottom: var(--space-xs);">
                                                    IMPROVE COVERAGE
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${i.uncoveredRoles} roles are managed through direct user assignments. Consider creating PIM groups for better management and audit trails.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `:""}
                                ${i.directUserAssignmentsCount>0?`
                                    <div style="background: rgba(59, 130, 246, 0.05); border-left: 3px solid var(--color-info); border-radius: var(--radius-sm); padding: var(--space-md); margin-bottom: var(--space-sm);" role="alert">
                                        <div style="display: flex; align-items: start; gap: var(--space-sm);">
                                            <i class="fas fa-users" style="color: var(--color-info); margin-top: 2px; font-size: 1.1rem;" aria-hidden="true"></i>
                                            <div style="flex: 1;">
                                                <div style="font-weight: 700; font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; color: var(--color-info); margin-bottom: var(--space-xs);">
                                                    DIRECT ASSIGNMENTS DETECTED
                                                </div>
                                                <div style="color: var(--text-secondary); line-height: 1.5; font-size: 0.9rem;">
                                                    ${i.directUserAssignmentsCount} direct user assignments found. Using PIM groups provides better access control and compliance.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `:""}
                                ${i.uncoveredRoles===0&&i.directUserAssignmentsCount===0?`
                                    <div style="text-align: center; padding: var(--space-xl);">
                                        <div style="width: 80px; height: 80px; margin: 0 auto var(--space-md); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                            <i class="fas fa-trophy" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                                        </div>
                                        <div style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; margin-bottom: var(--space-xs); color: var(--text-primary);">
                                            Perfect Coverage!
                                        </div>
                                        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">
                                            All roles are properly managed through PIM groups
                                        </div>
                                    </div>
                                `:""}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Roles Table -->
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--border-subtle); margin-top: var(--space-lg);">
                    <div style="position: absolute; bottom: 0; right: 0; width: 400px; height: 400px; background: radial-gradient(circle, var(--accent-secondary-dim), transparent); filter: blur(100px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1;">
                        <div style="display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg); border-bottom: 1px solid var(--border-subtle);">
                            <div style="width: 48px; height: 48px; background: var(--accent-secondary-dim); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
                                <i class="fas fa-table" style="color: var(--accent-secondary); font-size: 1.3rem;"></i>
                            </div>
                            <div>
                                <h2 style="font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.05em;">
                                    Detailed Analysis
                                </h2>
                                <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    Role-by-role coverage breakdown
                                </div>
                            </div>
                        </div>
                        <div style="overflow-x: auto;">
                            <table class="table" style="margin: 0;">
                                <thead>
                                    <tr style="background: rgba(0, 0, 0, 0.3);">
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Role Name</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Group Assignments</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Direct Assignments</th>
                                        <th style="font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${i.roles.map((r,s)=>`
                                        <tr style="border-bottom: 1px solid var(--border-subtle); background: ${s%2===0?"rgba(255, 0, 128, 0.02)":"transparent"};">
                                            <td style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">
                                                ${this.escapeHtml(r.roleName)}
                                            </td>
                                            <td>
                                                <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: ${r.groupCount>0?"var(--accent-primary)":"var(--text-muted)"};">
                                                    ${r.groupCount}
                                                </span>
                                            </td>
                                            <td>
                                                <span style="font-family: var(--font-mono); font-size: 0.9rem; font-weight: 600; color: ${r.userCount>0?"var(--color-warning)":"var(--text-muted)"};">
                                                    ${r.userCount}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="badge" style="background: ${r.isCovered?"var(--color-success-dim)":"var(--color-warning-dim)"}; color: ${r.isCovered?"var(--color-success)":"var(--color-warning)"}; font-family: var(--font-mono); font-size: 0.7rem; text-transform: uppercase; font-weight: 700;">
                                                    ${r.isCovered?"✓ COVERED":"⚠ DIRECT ONLY"}
                                                </span>
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `:`
                <div class="card" style="position: relative; overflow: hidden; background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary);">
                    <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, var(--accent-primary-dim), transparent); filter: blur(80px); pointer-events: none;"></div>
                    <div style="position: relative; z-index: 1; text-align: center; padding: var(--space-2xl);">
                        <div style="width: 150px; height: 150px; margin: 0 auto var(--space-xl); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 60px rgba(0, 255, 159, 0.3);">
                            <i class="fas fa-chart-pie" style="font-size: 4.5rem; color: var(--accent-primary);"></i>
                        </div>
                        <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md); text-transform: uppercase; letter-spacing: 0.05em;">
                            <span style="background: linear-gradient(135deg, var(--accent-primary), #00ffff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                                ANALYTICS READY
                            </span>
                        </h2>
                        <p style="color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.95rem; margin-bottom: var(--space-xl); max-width: 500px; margin-left: auto; margin-right: auto;">
                            ${this.isConnected()?"Generating comprehensive coverage analysis across all PIM roles and assignments":"Connect to Microsoft Entra ID to view role coverage analytics"}
                        </p>
                        ${this.isConnected()?`
                            <div style="display: inline-flex; align-items: center; gap: var(--space-sm); padding: var(--space-sm) var(--space-md); background: rgba(0, 255, 159, 0.1); border-radius: var(--radius-full); font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-primary);">
                                <div class="spinner" style="width: 16px; height: 16px;"></div>
                                <span>Loading data...</span>
                            </div>
                        `:""}
                    </div>
                </div>
            `}
        `}async refreshPage(){this.app.cacheManager.invalidate(N.COVERAGE.key),await this.app.router.refreshCurrentPage()}}class Rl extends V{constructor(e){super(e)}async render(e,t={}){const i=Gt.getDiagramTypes();e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">
                    <i class="fas fa-project-diagram"></i> PIMMaid
                </h1>
                <span class="page-subtitle">Visualize PIM as Mermaid Diagrams</span>
            </div>
            <p class="page-description">Generate visual diagrams of your PIM configuration showing relationships between users, groups, and roles.</p>

            <div class="pimmaid-layout">
                <div class="pimmaid-controls card">
                    <h3><i class="fas fa-sliders-h"></i> Diagram Options</h3>

                    <div class="form-group">
                        <label>Diagram Type</label>
                        <div class="diagram-type-grid">
                            ${Object.entries(i).map(([a,r])=>`
                                <label class="diagram-type-option ${a==="full-hierarchy"?"selected":""}" data-type="${a}">
                                    <input type="radio" name="diagram-type" value="${a}" ${a==="full-hierarchy"?"checked":""}>
                                    <i class="fas ${r.icon}"></i>
                                    <span class="type-name">${r.name}</span>
                                    <span class="type-desc">${r.description}</span>
                                </label>
                            `).join("")}
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Options</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="pimmaid-eligible" checked>
                                <span>Show Eligible Assignments</span>
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="pimmaid-active" checked>
                                <span>Show Active Assignments</span>
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Direction</label>
                        <select id="pimmaid-direction" class="input">
                            <option value="LR">Left to Right</option>
                            <option value="TB">Top to Bottom</option>
                            <option value="RL">Right to Left</option>
                            <option value="BT">Bottom to Top</option>
                        </select>
                    </div>

                    <button class="btn btn-primary btn-block" onclick="app.pages.pimmaid.generateDiagram()" ${this.isConnected()?"":"disabled"} aria-label="Generate Mermaid diagram">
                        <i class="fas fa-magic"></i> Generate Diagram
                    </button>

                    <div id="pimmaid-stats" class="pimmaid-stats hidden"></div>
                </div>

                <div class="pimmaid-output card">
                    <div class="pimmaid-output-header">
                        <h3><i class="fas fa-code"></i> Mermaid Output</h3>
                        <div class="pimmaid-actions">
                            <button class="btn btn-sm btn-secondary" onclick="app.pages.pimmaid.copyCode()" id="copy-mermaid-btn" disabled aria-label="Copy Mermaid code">
                                <i class="fas fa-copy"></i> Copy
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.pages.pimmaid.downloadCode()" id="download-mermaid-btn" disabled aria-label="Download Mermaid code">
                                <i class="fas fa-download"></i> Download
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="app.pages.pimmaid.openInMermaidLive()" id="live-mermaid-btn" disabled aria-label="Open in Mermaid Live Editor">
                                <i class="fas fa-external-link-alt"></i> Open in Mermaid Live
                            </button>
                        </div>
                    </div>

                    <div class="pimmaid-code-container">
                        <pre id="pimmaid-code" class="pimmaid-code">${this.isConnected()?'// Click "Generate Diagram" to create your PIM visualization':"// Connect to Azure AD to generate diagrams"}</pre>
                    </div>

                    <div class="pimmaid-preview-section">
                        <h4><i class="fas fa-eye"></i> Preview</h4>
                        <p class="preview-hint">Paste the code above into <a href="https://mermaid.live" target="_blank" rel="noopener noreferrer">Mermaid Live Editor</a> to see the rendered diagram.</p>
                        <div id="pimmaid-preview" class="pimmaid-preview">
                            <div class="empty-preview">
                                <i class="fas fa-project-diagram"></i>
                                <p>Diagram preview will appear here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `,document.querySelectorAll(".diagram-type-option").forEach(a=>{a.addEventListener("click",()=>{document.querySelectorAll(".diagram-type-option").forEach(r=>r.classList.remove("selected")),a.classList.add("selected"),a.querySelector("input").checked=!0})})}async generateDiagram(){var r;const e=((r=document.querySelector('input[name="diagram-type"]:checked'))==null?void 0:r.value)||"full-hierarchy",t=document.getElementById("pimmaid-eligible").checked,i=document.getElementById("pimmaid-active").checked,a=document.getElementById("pimmaid-direction").value;this.showLoading("Fetching PIM data...");try{const[s,n]=await Promise.all([E.getPIMGroups(),E.getRoleDefinitions()]);if(!s.success||!n.success)throw new Error("Failed to fetch PIM data");const c=s.groups,l=n.roles;this.showLoading("Fetching assignments...");let d={},u={};["user-group","full-hierarchy"].includes(e)&&(d=(await E.getAllGroupAssignments(c)).assignments||{}),["group-role","full-hierarchy","role-assignments"].includes(e)&&(u=(await E.getAllRoleAssignments()).assignments||{}),this.hideLoading();const p={groups:c,roles:l,groupAssignments:d,roleAssignments:u},h={showEligible:t,showActive:i,direction:a},m=Gt.generateDiagram(e,p,h),v=Gt.getStats(p);document.getElementById("pimmaid-code").textContent=m,document.getElementById("copy-mermaid-btn").disabled=!1,document.getElementById("download-mermaid-btn").disabled=!1,document.getElementById("live-mermaid-btn").disabled=!1;const w=document.getElementById("pimmaid-stats");w.innerHTML=`
                <h4><i class="fas fa-chart-bar"></i> Statistics</h4>
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-value">${v.totalUsers}</span>
                        <span class="stat-label">Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${v.totalGroups}</span>
                        <span class="stat-label">Groups</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${v.totalRoles}</span>
                        <span class="stat-label">Roles</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${v.eligibleAssignments}</span>
                        <span class="stat-label">Eligible</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${v.activeAssignments}</span>
                        <span class="stat-label">Active</span>
                    </div>
                </div>
                <div class="role-stats">
                    <span class="badge privilege-badge badge-critical">${v.rolesByPrivilege.critical} Critical</span>
                    <span class="badge privilege-badge badge-high">${v.rolesByPrivilege.high} High</span>
                    <span class="badge privilege-badge badge-medium">${v.rolesByPrivilege.medium} Medium</span>
                    <span class="badge privilege-badge badge-low">${v.rolesByPrivilege.low} Low</span>
                </div>
            `,w.classList.remove("hidden"),document.getElementById("pimmaid-preview").innerHTML=`
                <div class="preview-placeholder">
                    <i class="fas fa-check-circle"></i>
                    <p>Diagram generated! Copy the code or open in Mermaid Live to view.</p>
                    <p class="code-lines">${m.split(`
`).length} lines generated</p>
                </div>
            `,this.showToast("Diagram generated successfully","success")}catch(s){this.hideLoading(),this.showToast("Failed to generate diagram: "+s.message,"error")}}copyCode(){const e=document.getElementById("pimmaid-code").textContent;navigator.clipboard.writeText(e).then(()=>{this.showToast("Mermaid code copied to clipboard","success")}).catch(()=>{this.showToast("Failed to copy","error")})}downloadCode(){const e=document.getElementById("pimmaid-code").textContent,t=new Blob([e],{type:"text/plain"}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=`pimmaid-diagram-${new Date().toISOString().split("T")[0]}.mmd`,document.body.appendChild(a),a.click(),document.body.removeChild(a),URL.revokeObjectURL(i),this.showToast("Diagram downloaded","success")}openInMermaidLive(){const t={code:document.getElementById("pimmaid-code").textContent,mermaid:{theme:"dark"}},i=btoa(JSON.stringify(t));window.open(`https://mermaid.live/edit#base64:${i}`,"_blank")}async refreshPage(){await this.app.router.refreshCurrentPage()}}class xl extends V{constructor(e){super(e)}async render(e,t={}){e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">Role Policy Configuration</h1>
            </div>
            <p class="page-description">Configure PIM activation settings for Entra ID roles. Select a role from the list to view and edit its policy.</p>

            <div class="policy-layout">
                <div class="card policy-list">
                    <h3>Entra ID Roles</h3>
                    <p class="caption">Click a role to configure</p>
                    <input type="text" class="input" placeholder="Filter roles..." oninput="app.pages.policies.filterRoles(this.value)">
                    <div class="policy-items" id="policy-role-list">
                        ${this.isConnected()?'<p class="loading-text">Loading roles...</p>':'<p class="empty-text">Connect to view roles</p>'}
                    </div>
                </div>
                <div class="card policy-editor">
                    <div class="empty-state-large">
                        <i class="fas fa-file-alt"></i>
                        <h3>Select a role to configure its PIM policy</h3>
                        <p>Configure activation duration, MFA requirements, justification, approval, and more.</p>
                    </div>
                </div>
            </div>
        `,this.isConnected()&&await this.loadRoles()}async loadRoles(){let e=this.getCached(N.ROLES.key);if(!e){const t=await E.getRoleDefinitions();if(t.success)e=t.roles,this.setCached(N.ROLES.key,e);else{this.showToast(`Failed to load roles: ${t.error}`,"error");return}}this.allRoles=e,this.displayRoles(e)}displayRoles(e){const t=document.getElementById("policy-role-list");t&&(t.innerHTML=e.map(i=>`
            <div class="policy-item" onclick="app.pages.policies.selectRole('${i.id}', '${this.escapeHtml(i.displayName)}')">
                <strong>${this.escapeHtml(i.displayName)}</strong>
            </div>
        `).join(""))}filterRoles(e){if(!this.allRoles)return;const t=this.allRoles.filter(i=>i.displayName.toLowerCase().includes(e.toLowerCase()));this.displayRoles(t)}async selectRole(e,t){this.showToast(`Policy configuration for ${t} - Use Roles page for full editor`,"info")}async refreshPage(){this.app.cacheManager.invalidate(N.ROLES.key),await this.app.router.refreshCurrentPage()}}class Pl extends V{constructor(e){super(e)}async render(e,t={}){const i=Xe.getAllTemplates();e.innerHTML=`
            <h1 class="page-header">Policy Templates</h1>
            <p class="page-description">Apply predefined policy configurations to your PIM groups. Templates help ensure consistent security settings across your organization.</p>

            <div class="templates-grid">
                ${Object.values(i).map(a=>`
                    <div class="card template-card">
                        <div class="template-icon ${a.color||"primary"}">
                            <i class="fas ${a.icon}"></i>
                        </div>
                        <h3>${this.escapeHtml(a.name)}</h3>
                        <p class="template-description">${this.escapeHtml(a.description)}</p>
                        <div class="template-settings">
                            <div class="template-setting">
                                <span class="setting-label">Max Duration:</span>
                                <span class="setting-value">${a.settings.activation.maximumDurationHours}h</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">MFA:</span>
                                <span class="setting-value ${a.settings.activation.requireMfa?"enabled":"disabled"}">${a.settings.activation.requireMfa?"Required":"Optional"}</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">Approval:</span>
                                <span class="setting-value ${a.settings.activation.requireApproval?"enabled":"disabled"}">${a.settings.activation.requireApproval?"Required":"Optional"}</span>
                            </div>
                            <div class="template-setting">
                                <span class="setting-label">Justification:</span>
                                <span class="setting-value ${a.settings.activation.requireJustification?"enabled":"disabled"}">${a.settings.activation.requireJustification?"Required":"Optional"}</span>
                            </div>
                        </div>
                        <div class="template-actions">
                            <button class="btn btn-secondary btn-sm" onclick="app.pages.templates.viewDetails('${a.id}')" ${this.isConnected()?"":"disabled"} aria-label="View template details for ${this.escapeHtml(a.name)}">
                                <i class="fas fa-eye"></i> Details
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="app.pages.templates.applyTemplate('${a.id}')" ${this.isConnected()?"":"disabled"} aria-label="Apply template ${this.escapeHtml(a.name)}">
                                <i class="fas fa-play"></i> Apply
                            </button>
                        </div>
                    </div>
                `).join("")}
            </div>
        `}viewDetails(e){const t=Xe.getTemplate(e);if(!t){this.showToast("Template not found","error");return}const i=t.settings,a=`
            <h2><i class="fas ${t.icon}"></i> ${this.escapeHtml(t.name)}</h2>
            <p>${this.escapeHtml(t.description)}</p>

            <div class="template-detail-sections">
                <div class="detail-section">
                    <h3>Activation Settings</h3>
                    <table class="settings-table">
                        <tr><td>Maximum Duration</td><td>${i.activation.maximumDurationHours} hours</td></tr>
                        <tr><td>Require MFA</td><td>${i.activation.requireMfa?'<span class="badge success">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Justification</td><td>${i.activation.requireJustification?'<span class="badge success">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Ticket Info</td><td>${i.activation.requireTicketInfo?'<span class="badge success">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                        <tr><td>Require Approval</td><td>${i.activation.requireApproval?'<span class="badge warning">Yes</span>':'<span class="badge">No</span>'}</td></tr>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Eligible Assignment Settings</h3>
                    <table class="settings-table">
                        <tr><td>Allow Permanent</td><td>${i.eligibleAssignment.allowPermanent?'<span class="badge">Yes</span>':'<span class="badge warning">No</span>'}</td></tr>
                        <tr><td>Maximum Duration</td><td>${i.eligibleAssignment.maximumDurationDays} days</td></tr>
                    </table>
                </div>

                <div class="detail-section">
                    <h3>Active Assignment Settings</h3>
                    <table class="settings-table">
                        <tr><td>Allow Permanent</td><td>${i.activeAssignment.allowPermanent?'<span class="badge">Yes</span>':'<span class="badge warning">No</span>'}</td></tr>
                        <tr><td>Maximum Duration</td><td>${i.activeAssignment.maximumDurationDays} days</td></tr>
                    </table>
                </div>
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                <button type="button" class="btn btn-primary" onclick="app.closeModal(); app.pages.templates.applyTemplate('${e}')">
                    <i class="fas fa-play"></i> Apply Template
                </button>
            </div>
        `;this.showModal(a)}async applyTemplate(e){const t=Xe.getTemplate(e);if(!t){this.showToast("Template not found","error");return}this.showToast(`Template application for "${t.name}" - Full implementation pending`,"info")}async refreshPage(){await this.app.router.refreshCurrentPage()}}class _l extends V{constructor(e){super(e)}async render(e,t={}){e.innerHTML=`
            <h1 class="page-header">Import / Export</h1>

            <div class="export-grid">
                <div class="card">
                    <div class="card-header-icon">
                        <i class="fas fa-file-export primary"></i>
                        <h2>Export</h2>
                    </div>
                    <p>Export your PIM configuration for backup or migration.</p>

                    <div class="checkbox-group">
                        <label><input type="checkbox" id="export-groups" checked> PIM Groups</label>
                        <label><input type="checkbox" id="export-policies" checked> Policy Configurations</label>
                        <label><input type="checkbox" id="export-assignments" checked> Role Assignments</label>
                    </div>

                    <select class="input" id="export-format" aria-label="Export format">
                        <option value="json">JSON (Full Configuration)</option>
                        <option value="csv">CSV (Audit Report)</option>
                    </select>

                    <button class="btn btn-primary" onclick="app.pages.export.exportConfig()" ${this.isConnected()?"":"disabled"} aria-label="Export configuration">
                        <i class="fas fa-download"></i> Export
                    </button>
                </div>

                <div class="card">
                    <div class="card-header-icon">
                        <i class="fas fa-file-import secondary"></i>
                        <h2>Import</h2>
                    </div>
                    <p>Import PIM configuration from a JSON file.</p>

                    <div class="drop-zone" id="import-drop-zone">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Drop file here or click to browse</p>
                    </div>

                    <button class="btn btn-secondary" onclick="document.getElementById('import-file').click()" ${this.isConnected()?"":"disabled"} aria-label="Browse for import file">
                        <i class="fas fa-folder-open"></i> Browse Files
                    </button>
                    <input type="file" id="import-file" accept=".json" style="display:none" onchange="app.pages.export.handleImport(this.files)">
                </div>
            </div>
        `,this.setupDropZone()}setupDropZone(){const e=document.getElementById("import-drop-zone");e&&(e.addEventListener("dragover",t=>{t.preventDefault(),e.classList.add("drag-over")}),e.addEventListener("dragleave",()=>{e.classList.remove("drag-over")}),e.addEventListener("drop",t=>{t.preventDefault(),e.classList.remove("drag-over"),this.handleImport(t.dataTransfer.files)}),e.addEventListener("click",()=>{document.getElementById("import-file").click()}))}async exportConfig(){document.getElementById("export-groups").checked,document.getElementById("export-policies").checked,document.getElementById("export-assignments").checked;const e=document.getElementById("export-format").value;this.showToast(`Export functionality - Implementation pending (${e} format)`,"info")}handleImport(e){if(!e||e.length===0)return;const t=e[0];if(!t.name.endsWith(".json")){this.showToast("Please select a JSON file","error");return}const i=new FileReader;i.onload=a=>{try{const r=JSON.parse(a.target.result);this.showToast(`Imported configuration from ${t.name} - Application pending`,"info")}catch{this.showToast("Invalid JSON file","error")}},i.readAsText(t)}async refreshPage(){await this.app.router.refreshCurrentPage()}}class Ml extends V{constructor(e){super(e)}async render(e,t={}){const i=Lt();e.innerHTML=`
            <h1 class="page-header">Settings</h1>

            <div class="settings-container">
                <div class="card">
                    <h2>Appearance</h2>
                    <div class="setting-row">
                        <div>
                            <strong>Theme</strong>
                            <p>Choose between light and dark mode</p>
                        </div>
                        <select class="input" id="theme-select" onchange="app.setTheme(this.value)" aria-label="Theme selection">
                            <option value="light" ${this.app.isDarkMode?"":"selected"}>Light</option>
                            <option value="dark" ${this.app.isDarkMode?"selected":""}>Dark</option>
                        </select>
                    </div>
                </div>

                <div class="card">
                    <h2>App Configuration</h2>
                    ${i?`
                        <div class="config-info">
                            <p><strong>Client ID:</strong> <code>${this.escapeHtml(i.clientId)}</code></p>
                            <p><strong>Tenant ID:</strong> <code>${this.escapeHtml(i.tenantId)}</code></p>
                            <p><strong>Configured:</strong> ${new Date(i.createdAt).toLocaleString()}</p>
                        </div>
                        <button class="btn btn-secondary" onclick="app.resetSetup()" aria-label="Reset configuration">
                            <i class="fas fa-redo"></i> Reset Configuration
                        </button>
                    `:`
                        <p>App is not configured.</p>
                        <button class="btn btn-primary" onclick="app.showSetupWizard()" aria-label="Run setup wizard">
                            <i class="fas fa-magic"></i> Run Setup
                        </button>
                    `}
                </div>

                <div class="card">
                    <h2>Cache Management</h2>
                    <div class="setting-row">
                        <div>
                            <strong>Cache Statistics</strong>
                            <p>View and manage application cache</p>
                        </div>
                        <button class="btn btn-secondary" onclick="app.pages.settings.showCacheStats()" aria-label="View cache statistics">
                            <i class="fas fa-chart-bar"></i> View Stats
                        </button>
                    </div>
                    <div class="setting-row">
                        <div>
                            <strong>Clear Cache</strong>
                            <p>Clear all cached data and force fresh reload</p>
                        </div>
                        <button class="btn btn-danger" onclick="app.pages.settings.clearCache()" aria-label="Clear cache">
                            <i class="fas fa-trash"></i> Clear Cache
                        </button>
                    </div>
                </div>

                <div class="card">
                    <h2>About</h2>
                    <p><strong>PIMBuddy Web</strong> v1.0.0</p>
                    <p class="caption">Privileged Identity Management Tool for Microsoft Entra ID</p>
                    <p class="caption">Built with MSAL.js and Microsoft Graph API</p>
                    <div style="margin-top: var(--space-md);">
                        <p class="caption">
                            <i class="fas fa-code"></i> Modular architecture with TTL-based caching
                        </p>
                        <p class="caption">
                            <i class="fas fa-shield-alt"></i> Zero Trust compliant
                        </p>
                    </div>
                </div>
            </div>
        `}showCacheStats(){const e=this.app.cacheManager.getStats(),t=this.app.cacheManager.exportState(),i=`
            <h2><i class="fas fa-chart-bar"></i> Cache Statistics</h2>

            <div class="stats-grid" style="margin-bottom: var(--space-lg);">
                <div class="stat-card">
                    <div class="stat-value">${e.size}</div>
                    <div class="stat-label">Cached Items</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${e.hits}</div>
                    <div class="stat-label">Cache Hits</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${e.misses}</div>
                    <div class="stat-label">Cache Misses</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${e.hitRate}</div>
                    <div class="stat-label">Hit Rate</div>
                </div>
            </div>

            <h3>Cached Data</h3>
            <div style="max-height: 300px; overflow-y: auto; background: var(--bg-surface); padding: var(--space-md); border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.8rem;">
                ${Object.keys(t).length>0?Object.keys(t).map(a=>`
                    <div style="padding: var(--space-xs) 0; border-bottom: 1px solid var(--border-subtle);">
                        <strong>${this.escapeHtml(a)}</strong>
                        <span style="color: var(--text-muted); font-size: 0.75rem;">
                            (TTL: ${Math.floor(t[a].remainingTTL/1e3)}s remaining)
                        </span>
                    </div>
                `).join(""):'<p style="color: var(--text-muted);">No cached data</p>'}
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                <button type="button" class="btn btn-danger" onclick="app.closeModal(); app.pages.settings.clearCache()">
                    <i class="fas fa-trash"></i> Clear Cache
                </button>
            </div>
        `;this.showModal(i)}clearCache(){this.app.cacheManager.clear(),this.showToast("Cache cleared successfully","success"),this.app.router.refreshCurrentPage()}async refreshPage(){await this.app.router.refreshCurrentPage()}}class Nl extends V{constructor(e){super(e),this.baselineState={selectedBaseline:null,selectedTiers:[],validationResults:null,deploymentPlan:null,groupUsers:{},groupCustomizations:{}}}async render(e,t={}){const i=je.getBaselineConfigurations();e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">
                    <i class="fas fa-rocket"></i> PIM Baseline Deployment
                </h1>
                <span class="page-subtitle">One-shot PIM configuration based on best practices</span>
            </div>
            <p class="page-description">Deploy a complete PIM configuration with groups, policies, and role assignments based on industry best practices and Zero Trust principles.</p>

            <div id="baseline-wizard-step" data-step="1">
                <!-- Step 1: Baseline Selection -->
                <div id="baseline-step-1" class="baseline-step active">
                    <h2 class="step-title"><i class="fas fa-list-check"></i> Step 1: Choose Your Baseline</h2>

                    <div class="baseline-grid">
                        ${Object.entries(i).map(([a,r])=>`
                            <div class="card baseline-card" data-baseline="${a}">
                                <div class="baseline-header">
                                    <i class="fas ${r.icon} baseline-icon"></i>
                                    <h3>${r.name}</h3>
                                </div>
                                <p class="baseline-desc">${r.description}</p>

                                <div class="baseline-features">
                                    <h4>Key Features:</h4>
                                    <ul>
                                        ${r.features.map(s=>`<li><i class="fas fa-check-circle"></i> ${s}</li>`).join("")}
                                    </ul>
                                </div>

                                <div class="baseline-stats">
                                    <span class="stat-badge"><i class="fas fa-layer-group"></i> ${r.tiers.length} Tiers</span>
                                    <span class="stat-badge"><i class="fas fa-users"></i> ${r.tiers.reduce((s,n)=>s+n.groups.length,0)} Groups</span>
                                </div>

                                <button class="btn btn-primary btn-block" onclick="app.pages.baseline.selectBaseline('${a}')" ${this.isConnected()?"":"disabled"} aria-label="Select ${r.name} baseline">
                                    <i class="fas fa-arrow-right"></i> Select This Baseline
                                </button>
                            </div>
                        `).join("")}
                    </div>
                </div>

                <!-- Step 2: Tier & Group Selection -->
                <div id="baseline-step-2" class="baseline-step">
                    <h2 class="step-title"><i class="fas fa-layer-group"></i> Step 2: Configure Tiers & Groups</h2>

                    <div class="step-navigation">
                        <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()" aria-label="Go back">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>

                    <div id="baseline-tier-config" class="tier-config-container">
                        <!-- Populated dynamically -->
                    </div>

                    <div class="step-actions">
                        <button class="btn btn-primary" onclick="app.pages.baseline.validateConfiguration()" aria-label="Validate configuration">
                            <i class="fas fa-check-circle"></i> Validate Configuration
                        </button>
                    </div>
                </div>

                <!-- Step 3: Validation & Review -->
                <div id="baseline-step-3" class="baseline-step">
                    <h2 class="step-title"><i class="fas fa-clipboard-check"></i> Step 3: Review & Deploy</h2>

                    <div class="step-navigation">
                        <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()" aria-label="Go back">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </div>

                    <div id="baseline-validation-results" class="validation-results">
                        <!-- Populated after validation -->
                    </div>

                    <div id="baseline-deployment-plan" class="deployment-plan">
                        <!-- Populated after validation -->
                    </div>

                    <div class="step-actions">
                        <button class="btn btn-success btn-lg" onclick="app.pages.baseline.executeDeployment()" id="deploy-baseline-btn" aria-label="Deploy baseline">
                            <i class="fas fa-rocket"></i> Deploy Baseline
                        </button>
                    </div>
                </div>

                <!-- Step 4: Deployment Progress -->
                <div id="baseline-step-4" class="baseline-step">
                    <h2 class="step-title"><i class="fas fa-tasks"></i> Deployment in Progress</h2>

                    <div id="baseline-deployment-progress" class="deployment-progress">
                        <!-- Populated during deployment -->
                    </div>
                </div>
            </div>
        `,this.baselineState={selectedBaseline:null,selectedTiers:[],validationResults:null,deploymentPlan:null,groupUsers:{},groupCustomizations:{}}}selectBaseline(e){const t=je.getBaseline(e);this.baselineState.selectedBaseline=e;const i=document.getElementById("baseline-tier-config");i.innerHTML=`
            <div class="card">
                <h3><i class="fas fa-info-circle"></i> Selected: ${t.name}</h3>
                <p>${t.description}</p>
            </div>

            <div class="tiers-list">
                ${t.tiers.map((a,r)=>`
                    <div class="card tier-card">
                        <div class="tier-header">
                            <label class="checkbox-label tier-checkbox">
                                <input type="checkbox" class="tier-select" data-tier="${r}" checked>
                                <h3>
                                    ${a.tier===0?"💀":a.tier===1?"⚠️":"🔵"}
                                    ${a.name}
                                </h3>
                            </label>
                        </div>

                        <div class="tier-policy-summary">
                            <h4>Policy Configuration:</h4>
                            <div class="policy-grid">
                                <div class="policy-item">
                                    <i class="fas fa-clock"></i>
                                    <span>Max Duration: ${a.policy.maximumDurationHours}h</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>MFA: ${a.policy.requireMfa?"Required":"Optional"}</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-clipboard-check"></i>
                                    <span>Approval: ${a.policy.requireApproval?"Required":"Not Required"}</span>
                                </div>
                                <div class="policy-item">
                                    <i class="fas fa-comment-dots"></i>
                                    <span>Justification: ${a.policy.requireJustification?"Required":"Optional"}</span>
                                </div>
                            </div>
                        </div>

                        <div class="tier-groups">
                            <h4>Groups to Create (${a.groups.length}):</h4>
                            <p class="form-hint"><i class="fas fa-info-circle"></i> Click the arrow (▼) on each group to customize name and add users</p>
                            <div class="groups-list">
                                ${a.groups.map((s,n)=>`
                                    <div class="group-item baseline-group-item" data-tier="${r}" data-group-index="${n}">
                                        <div class="group-item-header">
                                            <label class="checkbox-label">
                                                <input type="checkbox" class="group-select" data-tier="${r}" data-group="${s.name}" checked>
                                                <div class="group-info-compact">
                                                    <i class="fas fa-users"></i>
                                                    <span>${s.name}</span>
                                                </div>
                                            </label>
                                            <button class="btn btn-sm btn-secondary" onclick="app.pages.baseline.toggleGroupDetails(${r}, ${n})" aria-label="Toggle group details">
                                                <i class="fas fa-chevron-down"></i>
                                            </button>
                                        </div>

                                        <div class="group-item-details" id="group-details-${r}-${n}">
                                            <div class="form-group">
                                                <label>Group Name</label>
                                                <input type="text" class="input group-name-input"
                                                    data-tier="${r}"
                                                    data-group-index="${n}"
                                                    data-original="${s.name}"
                                                    value="${s.name}"
                                                    aria-label="Group name">
                                                <small class="form-hint">Customize the group name (must be unique)</small>
                                            </div>

                                            <div class="form-group">
                                                <label>Description</label>
                                                <textarea class="input group-desc-input"
                                                    data-tier="${r}"
                                                    data-group-index="${n}"
                                                    rows="2"
                                                    aria-label="Group description">${s.description}</textarea>
                                            </div>

                                            <div class="form-group">
                                                <label>Assigned Roles</label>
                                                <div class="group-roles-list">
                                                    <i class="fas fa-user-shield"></i>
                                                    ${s.roles.length} role${s.roles.length!==1?"s":""}
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label>Assignment Type</label>
                                                <div class="assignment-type-toggle">
                                                    <label class="toggle-option ${s.isActive?"":"active"}" data-tier="${r}" data-group-index="${n}" data-type="eligible">
                                                        <input type="radio" name="assignment-type-${r}-${n}" value="eligible" checked>
                                                        <div class="toggle-content">
                                                            <i class="fas fa-clock"></i>
                                                            <span>Eligible</span>
                                                            <small>Users activate when needed</small>
                                                        </div>
                                                    </label>
                                                    <label class="toggle-option ${s.isActive?"active":""}" data-tier="${r}" data-group-index="${n}" data-type="active">
                                                        <input type="radio" name="assignment-type-${r}-${n}" value="active">
                                                        <div class="toggle-content">
                                                            <i class="fas fa-check-circle"></i>
                                                            <span>Active</span>
                                                            <small>Always active (permanent)</small>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <label>Add Users (Optional)</label>
                                                <div class="user-search-container">
                                                    <input type="text"
                                                        class="input user-search-input"
                                                        data-tier="${r}"
                                                        data-group-index="${n}"
                                                        placeholder="Search users by name or email..."
                                                        aria-label="Search users">
                                                    <div class="user-search-results" id="user-search-results-${r}-${n}"></div>
                                                </div>
                                                <div class="selected-users-list" id="selected-users-${r}-${n}">
                                                    <small class="form-hint">No users added yet. Search above to add users.</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        `,this.goToStep(2),this.baselineState.groupUsers={},this.baselineState.groupCustomizations={},document.querySelectorAll(".tier-select").forEach(a=>{a.addEventListener("change",r=>{const s=parseInt(r.target.dataset.tier);document.querySelectorAll(`.group-select[data-tier="${s}"]`).forEach(c=>{c.checked=r.target.checked,c.disabled=!r.target.checked})})}),document.querySelectorAll(".toggle-option").forEach(a=>{a.addEventListener("click",r=>{const s=r.currentTarget,n=s.dataset.tier,c=s.dataset.groupIndex,l=s.dataset.type;document.querySelectorAll(`.toggle-option[data-tier="${n}"][data-group-index="${c}"]`).forEach(p=>p.classList.remove("active")),s.classList.add("active"),s.querySelector('input[type="radio"]').checked=!0;const u=`${n}-${c}`;this.baselineState.groupCustomizations[u]||(this.baselineState.groupCustomizations[u]={}),this.baselineState.groupCustomizations[u].assignmentType=l})}),document.querySelectorAll(".user-search-input").forEach(a=>{let r;a.addEventListener("input",s=>{clearTimeout(r);const n=s.target.value.trim(),c=s.target.dataset.tier,l=s.target.dataset.groupIndex;if(n.length<2){document.getElementById(`user-search-results-${c}-${l}`).innerHTML="";return}r=setTimeout(()=>{this.searchUsers(c,l,n)},300)})})}toggleGroupDetails(e,t){const i=document.getElementById(`group-details-${e}-${t}`),r=event.target.closest("button").querySelector("i");i.style.display==="none"||!i.style.display?(i.style.display="block",r.className="fas fa-chevron-up"):(i.style.display="none",r.className="fas fa-chevron-down")}async searchUsers(e,t,i){const a=document.getElementById(`user-search-results-${e}-${t}`);a.innerHTML='<div class="search-loading"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';try{const r=await E.searchUsers(i);r.success&&r.users.length>0?a.innerHTML=r.users.map(s=>`
                    <div class="user-search-result" onclick="app.pages.baseline.addUser(${e}, ${t}, '${s.id}', '${this.escapeHtml(s.displayName)}', '${this.escapeHtml(s.userPrincipalName)}')">
                        <div class="user-info">
                            <i class="fas fa-user"></i>
                            <div>
                                <div class="user-name">${this.escapeHtml(s.displayName)}</div>
                                <div class="user-email">${this.escapeHtml(s.userPrincipalName)}</div>
                            </div>
                        </div>
                        <i class="fas fa-plus-circle"></i>
                    </div>
                `).join(""):a.innerHTML='<div class="search-no-results">No users found</div>'}catch{a.innerHTML='<div class="search-error">Search failed</div>'}}addUser(e,t,i,a,r){const s=`${e}-${t}`;if(this.baselineState.groupUsers[s]||(this.baselineState.groupUsers[s]=[]),this.baselineState.groupUsers[s].some(n=>n.id===i)){this.showToast("User already added to this group","info");return}this.baselineState.groupUsers[s].push({id:i,displayName:a,userPrincipalName:r}),this.updateUsersList(e,t),document.querySelector(`.user-search-input[data-tier="${e}"][data-group-index="${t}"]`).value="",document.getElementById(`user-search-results-${e}-${t}`).innerHTML="",this.showToast(`Added ${a} to group`,"success")}removeUser(e,t,i){const a=`${e}-${t}`;this.baselineState.groupUsers[a]&&(this.baselineState.groupUsers[a]=this.baselineState.groupUsers[a].filter(r=>r.id!==i),this.updateUsersList(e,t))}updateUsersList(e,t){const i=`${e}-${t}`,a=this.baselineState.groupUsers[i]||[],r=document.getElementById(`selected-users-${e}-${t}`);a.length===0?r.innerHTML='<small class="form-hint">No users added yet. Search above to add users.</small>':r.innerHTML=`
                <div class="selected-users-header">
                    <strong>${a.length} user${a.length!==1?"s":""} will be added:</strong>
                </div>
                ${a.map(s=>`
                    <div class="selected-user-item">
                        <div class="user-info">
                            <i class="fas fa-user"></i>
                            <div>
                                <div class="user-name">${this.escapeHtml(s.displayName)}</div>
                                <div class="user-email">${this.escapeHtml(s.userPrincipalName)}</div>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="app.pages.baseline.removeUser(${e}, ${t}, '${s.id}')" aria-label="Remove user">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `).join("")}
            `}async validateConfiguration(){if(!this.baselineState.selectedBaseline){this.showToast("No baseline selected","error");return}this.showLoading("Validating configuration...");try{const e=je.getBaseline(this.baselineState.selectedBaseline),t={baseline:this.baselineState.selectedBaseline,tiers:[]};document.querySelectorAll(".tier-select:checked").forEach(n=>{const c=parseInt(n.dataset.tier),l=e.tiers[c],d=[];document.querySelectorAll(`.group-select[data-tier="${c}"]:checked`).forEach(u=>{const p=u.dataset.group,h=l.groups.findIndex(v=>v.name===p),m=l.groups[h];if(m&&h!==-1){const v=document.querySelector(`.group-name-input[data-tier="${c}"][data-group-index="${h}"]`),w=document.querySelector(`.group-desc-input[data-tier="${c}"][data-group-index="${h}"]`),C=document.querySelector(`input[name="assignment-type-${c}-${h}"]:checked`),T={...m,name:v?v.value.trim():m.name,description:w?w.value.trim():m.description,originalName:m.name,assignmentType:C?C.value:"eligible"},P=`${c}-${h}`;this.baselineState.groupCustomizations[P]={name:T.name,description:T.description,users:this.baselineState.groupUsers[P]||[],assignmentType:T.assignmentType},d.push(T)}}),d.length>0&&t.tiers.push({...l,groups:d})}),this.baselineState.selectedTiers=t.tiers;const i=await E.getPIMGroups(),a=await E.getRoleDefinitions(),r=je.validateBaseline(t,{existingGroups:i.groups||[],existingRoles:a.roles||[]});this.baselineState.validationResults=r;const s=je.calculateDeploymentPlan(t,{existingGroups:i.groups||[],existingRoles:a.roles||[]});this.baselineState.deploymentPlan=s,this.hideLoading(),this.displayValidationResults(r,s),this.goToStep(3)}catch(e){this.hideLoading(),this.showToast("Validation failed: "+e.message,"error")}}displayValidationResults(e,t){const i=document.getElementById("baseline-validation-results"),a=document.getElementById("baseline-deployment-plan"),r=e.errors.length>0,s=e.warnings.length>0;i.innerHTML=`
            <div class="card ${r?"validation-error":s?"validation-warning":"validation-success"}">
                <h3>
                    <i class="fas ${r?"fa-times-circle":s?"fa-exclamation-triangle":"fa-check-circle"}"></i>
                    Validation ${r?"Failed":s?"Passed with Warnings":"Passed"}
                </h3>

                ${e.errors.length>0?`
                    <div class="validation-section validation-errors">
                        <h4><i class="fas fa-times-circle"></i> Errors</h4>
                        <ul>
                            ${e.errors.map(c=>`<li>${this.escapeHtml(c)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}

                ${e.warnings.length>0?`
                    <div class="validation-section validation-warnings">
                        <h4><i class="fas fa-exclamation-triangle"></i> Warnings</h4>
                        <ul>
                            ${e.warnings.map(c=>`<li>${this.escapeHtml(c)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}

                ${!r&&!s?`
                    <p><i class="fas fa-check"></i> Configuration is valid and ready for deployment.</p>
                `:""}

                ${e.newGroups&&e.newGroups.length>0?`
                    <div class="validation-summary">
                        <h4><i class="fas fa-info-circle"></i> Summary</h4>
                        <p><strong>${e.newGroups.length} new group(s)</strong> will be created:</p>
                        <ul class="group-list-compact">
                            ${e.newGroups.map(c=>`<li><i class="fas fa-plus-circle"></i> ${this.escapeHtml(c)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}

                ${e.existingGroups&&e.existingGroups.length>0?`
                    <div class="validation-summary">
                        <p><strong>${e.existingGroups.length} existing group(s)</strong> will be skipped:</p>
                        <ul class="group-list-compact">
                            ${e.existingGroups.map(c=>`<li><i class="fas fa-check-circle"></i> ${this.escapeHtml(c)}</li>`).join("")}
                        </ul>
                    </div>
                `:""}
            </div>
        `,a.innerHTML=`
            <div class="card deployment-plan-card">
                <h3><i class="fas fa-tasks"></i> Deployment Plan</h3>

                <div class="plan-summary">
                    <div class="plan-stat">
                        <span class="plan-value">${t.groupsToCreate.length}</span>
                        <span class="plan-label">Groups to Create</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${t.policiesToConfigure.length}</span>
                        <span class="plan-label">Policies to Configure</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${t.roleAssignmentsToCreate.length}</span>
                        <span class="plan-label">Role Assignments</span>
                    </div>
                    <div class="plan-stat">
                        <span class="plan-value">${t.estimatedTime}</span>
                        <span class="plan-label">Est. Time</span>
                    </div>
                </div>

                <div class="plan-details">
                    <h4>Deployment Steps:</h4>
                    <ol class="deployment-steps-list">
                        ${t.steps.map(c=>`
                            <li>
                                <i class="fas ${c.icon}"></i>
                                <strong>${this.escapeHtml(c.title)}</strong>
                                <p>${this.escapeHtml(c.description)}</p>
                            </li>
                        `).join("")}
                    </ol>
                </div>

                <div class="plan-groups-preview">
                    <h4>Groups to be created:</h4>
                    <div class="groups-preview-list">
                        ${t.groupsToCreate.map(c=>`
                            <div class="group-preview-item">
                                <i class="fas fa-users"></i>
                                <div>
                                    <strong>${this.escapeHtml(c.displayName)}</strong>
                                    <p>${this.escapeHtml(c.description)}</p>
                                </div>
                            </div>
                        `).join("")}
                    </div>
                </div>
            </div>
        `;const n=document.getElementById("deploy-baseline-btn");n&&(n.disabled=r)}async executeDeployment(){if(!this.baselineState.deploymentPlan){this.showToast("No deployment plan available","error");return}if(!confirm(`This will create ${this.baselineState.deploymentPlan.groupsToCreate.length} groups and configure their policies.

This action cannot be undone automatically. Continue?`))return;this.goToStep(4);const t=document.getElementById("baseline-deployment-progress"),i=this.baselineState.deploymentPlan,a=i.groupsToCreate.reduce((c,l)=>{var d;return c+(((d=l.roles)==null?void 0:d.length)||0)},0),r=i.groupsToCreate.length+a+a;let s=0;const n=(c,l=!1)=>{s++;const d=Math.round(s/r*100),u=document.createElement("div");u.className=`deployment-log-entry ${l?"log-error":"log-success"}`,u.innerHTML=`
                <i class="fas ${l?"fa-times-circle":"fa-check-circle"}"></i>
                <span>${c}</span>
            `;const p=t.querySelector(".deployment-log")||(()=>{const m=document.createElement("div");return m.className="deployment-log",t.appendChild(m),m})();p.appendChild(u),p.scrollTop=p.scrollHeight;const h=t.querySelector(".progress-bar-fill");h&&(h.style.width=`${d}%`,h.textContent=`${d}%`)};t.innerHTML=`
            <div class="card">
                <h3><i class="fas fa-spinner fa-spin"></i> Deploying Baseline Configuration</h3>
                <div class="progress-bar">
                    <div class="progress-bar-fill" style="width: 0%">0%</div>
                </div>
                <div class="deployment-log"></div>
            </div>
        `;try{n("Fetching role information...");const c=await E.getRoleDefinitions(),l=new Map;c.success&&c.roles.forEach(h=>{l.set(h.id,h.displayName)}),n("Starting group creation...");const d=[];for(const h of i.groupsToCreate)try{const m=await E.createPIMGroup(h.displayName,h.description,h.mailNickname);m.success?(d.push({config:h,group:m.group}),n(`✓ Created group: ${h.displayName}`)):n(`✗ Failed to create group: ${h.displayName} - ${m.error}`,!0)}catch(m){n(`✗ Error creating group: ${h.displayName} - ${m.message}`,!0)}n("Waiting for groups to provision (30-60 seconds)..."),await new Promise(h=>setTimeout(h,3e4)),n("Assigning groups to roles...");const u=[];for(const h of d){const m=h.config.roles||[],v=Object.entries(this.baselineState.groupCustomizations||{}).find(([C,T])=>T.name===h.config.displayName),w=v?v[1].assignmentType:"eligible";for(const C of m)try{let T;if(w==="active"?T=await E.createDirectoryRoleActiveAssignment(h.group.id,C,`Baseline deployment (Active): ${h.config.displayName}`):T=await E.createDirectoryRoleEligibilityAssignment(h.group.id,C,`Baseline deployment (Eligible): ${h.config.displayName}`,12),T.success){const P=l.get(C)||C;u.push({groupId:h.group.id,groupName:h.config.displayName,roleId:C,roleName:P,policy:h.config.policy}),n(`✓ Assigned ${h.config.displayName} to ${P} (${w})`)}else n(`✗ Failed to assign ${h.config.displayName}: ${T.error}`,!0)}catch(T){n(`✗ Error assigning ${h.config.displayName}: ${T.message}`,!0)}}if(n("Waiting for role assignments to propagate (10 seconds)..."),await new Promise(h=>setTimeout(h,1e4)),n(`✓ Role assignments complete. ${u.length} groups assigned to roles.`),u.length>0){n("Configuring role policies...");const h=new Map;u.forEach(m=>{h.has(m.roleId)||h.set(m.roleId,{roleId:m.roleId,roleName:m.roleName,groupName:m.groupName,policy:m.policy})});for(const[m,v]of h)try{n(`Fetching policy for ${v.roleName}...`);const w=await E.getRolePolicy(m);if(w.success&&w.policy){let C=0;try{await E.updateRolePolicy(w.policy.id,"Expiration_EndUser_Assignment",{maximumDuration:`PT${v.policy.maximumDurationHours}H`,isExpirationRequired:!0}),C++}catch(T){console.error("Expiration rule update failed:",T)}try{await E.updateRolePolicy(w.policy.id,"Enablement_EndUser_Assignment",{enabledRules:[v.policy.requireMfa?"MultiFactorAuthentication":null,v.policy.requireJustification?"Justification":null,v.policy.requireTicketInfo?"Ticketing":null].filter(T=>T!==null)}),C++}catch(T){console.error("Enablement rule update failed:",T)}try{await E.updateRolePolicy(w.policy.id,"Approval_EndUser_Assignment",{isApprovalRequired:v.policy.requireApproval}),C++}catch(T){console.error("Approval rule update failed:",T)}C>0?n(`✓ Updated ${v.roleName} policy (${C}/3 rules)`):n(`⚠ Could not update ${v.roleName} policy`,!1)}else{const C=w.error||"Unknown error";n(`⚠ Could not fetch ${v.roleName} policy: ${C}`,!1)}}catch(w){n(`⚠ Policy update error: ${w.message}`,!1)}}const p=Object.values(this.baselineState.groupUsers||{}).reduce((h,m)=>h+m.length,0);if(p>0){n(`Adding ${p} users to groups...`);for(const h of d){const m=Object.entries(this.baselineState.groupCustomizations||{}).find(([v,w])=>w.name===h.config.displayName);if(m&&m[1].users&&m[1].users.length>0){const v=m[1].users;for(const w of v)try{const C=await E.createEligibleAssignment(h.group.id,w.id,"member",null,null);C.success?n(`✓ Added ${w.displayName} to ${h.config.displayName}`):n(`✗ Failed to add ${w.displayName}: ${C.error}`,!0)}catch(C){n(`✗ Error adding ${w.displayName}: ${C.message}`,!0)}}}}n("Deployment completed!"),t.innerHTML+=`
                <div class="deployment-complete">
                    <i class="fas fa-check-circle"></i>
                    <h3>Baseline Deployed Successfully!</h3>
                    <p>Created ${d.length} groups with configured policies.</p>
                    <div class="deployment-actions">
                        <button class="btn btn-primary" onclick="app.navigateTo('groups')">
                            <i class="fas fa-users"></i> View Groups
                        </button>
                        <button class="btn btn-secondary" onclick="app.router.refreshCurrentPage()">
                            <i class="fas fa-redo"></i> Deploy Another Baseline
                        </button>
                    </div>
                </div>
            `,this.showToast("Baseline deployed successfully!","success")}catch(c){n(`✗ Deployment failed: ${c.message}`,!0),this.showToast("Deployment failed: "+c.message,"error"),t.innerHTML+=`
                <div class="deployment-error">
                    <i class="fas fa-exclamation-circle"></i>
                    <h3>Deployment Failed</h3>
                    <p>${this.escapeHtml(c.message)}</p>
                    <button class="btn btn-secondary" onclick="app.pages.baseline.previousStep()">
                        <i class="fas fa-arrow-left"></i> Go Back
                    </button>
                </div>
            `}}goToStep(e){document.querySelectorAll(".baseline-step").forEach(i=>{i.classList.remove("active")});const t=document.getElementById(`baseline-step-${e}`);t&&(t.classList.add("active"),document.getElementById("baseline-wizard-step").dataset.step=e)}previousStep(){const e=parseInt(document.getElementById("baseline-wizard-step").dataset.step);e>1&&this.goToStep(e-1)}async refreshPage(){await this.app.router.refreshCurrentPage()}}class Ol extends V{constructor(e){super(e),this.currentTab="eligible"}async render(e,t={}){let i=[],a=[];if(this.isConnected()){this.showLoading("Loading role assignments...");const[r,s]=await Promise.all([E.getMyEligibleRoles(),E.getMyActiveRoles()]);r.success?i=r.roles:this.showToast(`Failed to load eligible roles: ${r.error}`,"error"),s.success?a=s.roles:this.showToast(`Failed to load active roles: ${s.error}`,"error"),this.hideLoading()}e.innerHTML=`
            <div class="page-header-row">
                <h1 class="page-header">
                    <i class="fas fa-user-clock"></i> My Role Activations
                </h1>
            </div>

            <div class="info-banner">
                <i class="fas fa-info-circle"></i>
                <div>
                    <strong>Just-in-Time Access</strong>
                    <p>Activate eligible roles when needed. Activations are time-limited and require justification.</p>
                </div>
            </div>

            <div class="tabs">
                <button class="tab-btn ${this.currentTab==="eligible"?"active":""}"
                        onclick="app.pages.activations.switchTab('eligible')">
                    <i class="fas fa-unlock"></i> Eligible Roles (${i.length})
                </button>
                <button class="tab-btn ${this.currentTab==="active"?"active":""}"
                        onclick="app.pages.activations.switchTab('active')">
                    <i class="fas fa-check-circle"></i> Active Roles (${a.length})
                </button>
            </div>

            <!-- Eligible Roles Tab -->
            <div id="tab-eligible" class="tab-content ${this.currentTab==="eligible"?"active":""}"
                 style="display: ${this.currentTab==="eligible"?"block":"none"};">
                ${this.renderEligibleRoles(i)}
            </div>

            <!-- Active Roles Tab -->
            <div id="tab-active" class="tab-content ${this.currentTab==="active"?"active":""}"
                 style="display: ${this.currentTab==="active"?"block":"none"};">
                ${this.renderActiveRoles(a)}
            </div>
        `}renderEligibleRoles(e){return this.isConnected()?e.length===0?'<div class="empty-state"><i class="fas fa-inbox"></i><p>You have no eligible role assignments</p></div>':`
            <div class="card">
                <div class="card-header">
                    <h3>Roles You Can Activate</h3>
                    <p class="card-subtitle">Click "Activate" to request time-limited access to a role</p>
                </div>

                <div class="roles-grid">
                    ${e.map(t=>`
                        <div class="role-card eligible-role">
                            <div class="role-card-header">
                                <div class="role-icon ${this.getPrivilegeClass(t.privilegeLevel)}">
                                    <i class="fas ${this.getPrivilegeIcon(t.privilegeLevel)}"></i>
                                </div>
                                <div class="role-info">
                                    <h4>${this.escapeHtml(t.displayName)}</h4>
                                    <p class="role-description">${this.escapeHtml(t.description||"No description")}</p>
                                </div>
                            </div>

                            <div class="role-card-body">
                                <div class="role-meta">
                                    <div class="meta-item">
                                        <i class="fas fa-shield-alt"></i>
                                        <span>${this.formatPrivilegeLevel(t.privilegeLevel)}</span>
                                    </div>
                                    <div class="meta-item">
                                        <i class="fas fa-clock"></i>
                                        <span>Max: ${t.maxDuration||"8"} hours</span>
                                    </div>
                                    ${t.requiresApproval?`
                                        <div class="meta-item warning">
                                            <i class="fas fa-user-check"></i>
                                            <span>Requires Approval</span>
                                        </div>
                                    `:""}
                                    ${t.requiresMfa?`
                                        <div class="meta-item">
                                            <i class="fas fa-key"></i>
                                            <span>Requires MFA</span>
                                        </div>
                                    `:""}
                                </div>

                                ${t.assignmentEnd?`
                                    <div class="assignment-expires">
                                        <i class="fas fa-hourglass-end"></i>
                                        <span>Eligibility expires: ${new Date(t.assignmentEnd).toLocaleDateString()}</span>
                                    </div>
                                `:""}
                            </div>

                            <div class="role-card-footer">
                                <button class="btn btn-primary btn-block"
                                        onclick="app.pages.activations.showActivationForm('${t.roleId}', '${this.escapeHtml(t.displayName)}', '${t.privilegeLevel}')">
                                    <i class="fas fa-play-circle"></i> Activate Role
                                </button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        `:'<div class="empty-state"><i class="fas fa-plug"></i><p>Connect to view your eligible roles</p></div>'}renderActiveRoles(e){return this.isConnected()?e.length===0?'<div class="empty-state"><i class="fas fa-check-circle"></i><p>You have no active role assignments</p></div>':`
            <div class="card">
                <div class="card-header">
                    <h3>Currently Active Roles</h3>
                    <p class="card-subtitle">These roles are currently active and will automatically expire</p>
                </div>

                <div class="roles-grid">
                    ${e.map(t=>{const i=this.calculateTimeRemaining(t.endDateTime),a=i.hours<1;return`
                            <div class="role-card active-role ${a?"expiring-soon":""}">
                                <div class="role-card-header">
                                    <div class="role-icon active">
                                        <i class="fas fa-check-circle"></i>
                                    </div>
                                    <div class="role-info">
                                        <h4>${this.escapeHtml(t.displayName)}</h4>
                                        <p class="role-description">${this.escapeHtml(t.description||"No description")}</p>
                                    </div>
                                </div>

                                <div class="role-card-body">
                                    <div class="activation-timeline">
                                        <div class="timeline-item">
                                            <i class="fas fa-play-circle"></i>
                                            <div>
                                                <strong>Activated</strong>
                                                <span>${new Date(t.startDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div class="timeline-item ${a?"warning":""}">
                                            <i class="fas fa-stop-circle"></i>
                                            <div>
                                                <strong>Expires ${a?"(Soon)":""}</strong>
                                                <span>${new Date(t.endDateTime).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="time-remaining ${a?"urgent":""}">
                                        <i class="fas fa-hourglass-${a?"end":"half"}"></i>
                                        <span>
                                            <strong>Time Remaining:</strong>
                                            ${this.formatTimeRemaining(i)}
                                        </span>
                                    </div>

                                    ${t.justification?`
                                        <div class="activation-justification">
                                            <strong>Justification:</strong>
                                            <p>${this.escapeHtml(t.justification)}</p>
                                        </div>
                                    `:""}

                                    ${t.ticketNumber?`
                                        <div class="activation-ticket">
                                            <i class="fas fa-ticket-alt"></i>
                                            <span>Ticket: ${this.escapeHtml(t.ticketNumber)}</span>
                                        </div>
                                    `:""}
                                </div>

                                <div class="role-card-footer">
                                    <button class="btn btn-secondary btn-sm"
                                            onclick="app.pages.activations.extendActivation('${t.id}', '${this.escapeHtml(t.displayName)}')"
                                            ${t.canExtend?"":"disabled"}
                                            title="${t.canExtend?"Extend activation":"Cannot extend further"}">
                                        <i class="fas fa-clock"></i> Extend
                                    </button>
                                    <button class="btn btn-danger btn-sm"
                                            onclick="app.pages.activations.deactivateRole('${t.id}', '${this.escapeHtml(t.displayName)}')">
                                        <i class="fas fa-stop-circle"></i> Deactivate
                                    </button>
                                </div>
                            </div>
                        `}).join("")}
                </div>
            </div>
        `:'<div class="empty-state"><i class="fas fa-plug"></i><p>Connect to view your active roles</p></div>'}switchTab(e){this.currentTab=e,this.app.router.refreshCurrentPage()}async showActivationForm(e,t,i="medium"){const a=await E.getRoleAssignmentDetails(e);if(!a.success){this.showToast(`Failed to load role policy: ${a.error}`,"error");return}const r=a,s=`
            <div class="modal-header">
                <h2 class="modal-title">
                    <i class="fas fa-play-circle"></i> Activate Role
                </h2>
                <button class="modal-close" onclick="app.closeModal()" title="Close" aria-label="Close dialog">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="modal-body modal-lg">
                <div class="activation-header">
                    <div class="role-badge ${this.getPrivilegeClass(i)}">
                        <i class="fas ${this.getPrivilegeIcon(i)}"></i>
                    </div>
                    <div>
                        <h3>${this.escapeHtml(t)}</h3>
                        <p class="text-muted">Activate this role for just-in-time access</p>
                    </div>
                </div>

                <form id="activation-form">
                    <!-- Duration -->
                    <div class="form-section">
                        <label class="form-label">
                            <strong>Activation Duration <span class="required">*</span></strong>
                            <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.5rem;">
                                <input type="number"
                                       name="duration"
                                       class="input"
                                       min="0.5"
                                       max="${r.maxDuration||8}"
                                       step="0.5"
                                       value="${r.defaultDuration||4}"
                                       required
                                       style="flex: 1;"
                                       aria-label="Activation duration in hours">
                                <span>hours</span>
                            </div>
                            <small class="form-hint">Maximum: ${r.maxDuration||8} hours</small>
                        </label>

                        <div class="duration-presets">
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 1">1h</button>
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 4">4h</button>
                            <button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = 8">8h</button>
                            ${r.maxDuration>8?`<button type="button" class="btn btn-sm btn-secondary" onclick="document.querySelector('[name=duration]').value = ${r.maxDuration}">${r.maxDuration}h</button>`:""}
                        </div>
                    </div>

                    <!-- Justification -->
                    ${r.requiresJustification!==!1?`
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Business Justification ${r.requiresJustification?'<span class="required">*</span>':""}</strong>
                                <textarea name="justification"
                                          class="input"
                                          rows="4"
                                          placeholder="Explain why you need this role activated..."
                                          ${r.requiresJustification?"required":""}
                                          aria-label="Business justification for activation"></textarea>
                                <small class="form-hint">Provide a clear business reason for activating this role</small>
                            </label>
                        </div>
                    `:""}

                    <!-- Ticket Number -->
                    ${r.requiresTicket?`
                        <div class="form-section">
                            <label class="form-label">
                                <strong>Ticket/Change Number <span class="required">*</span></strong>
                                <input type="text"
                                       name="ticketNumber"
                                       class="input"
                                       placeholder="e.g., CHG0001234, INC0005678"
                                       required
                                       aria-label="Ticket or change number">
                                <small class="form-hint">Enter your change management or incident ticket number</small>
                            </label>
                        </div>
                    `:""}

                    <!-- Requirements Notice -->
                    ${r.requiresApproval||r.requiresMFA?`
                        <div class="requirements-notice">
                            <h4><i class="fas fa-info-circle"></i> Additional Requirements</h4>
                            <ul>
                                ${r.requiresMFA?'<li><i class="fas fa-key"></i> You will be prompted for Multi-Factor Authentication (MFA)</li>':""}
                                ${r.requiresApproval?`
                                    <li>
                                        <i class="fas fa-user-check"></i> This activation requires approval
                                        ${r.approvers&&r.approvers.length>0?`
                                            <ul class="approvers-list">
                                                ${r.approvers.map(n=>`<li>${this.escapeHtml(n.displayName||n.userPrincipalName||n)}</li>`).join("")}
                                            </ul>
                                        `:""}
                                    </li>
                                `:""}
                            </ul>
                        </div>
                    `:""}

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-play-circle"></i> ${r.requiresApproval?"Request Activation":"Activate Now"}
                        </button>
                    </div>
                </form>
            </div>
        `;this.showModal(s),document.getElementById("activation-form").addEventListener("submit",async n=>{n.preventDefault(),await this.handleActivationSubmit(e,t,n.target)})}async handleActivationSubmit(e,t,i){var n,c;const a=new FormData(i),r={roleId:e,duration:parseFloat(a.get("duration")),justification:((n=a.get("justification"))==null?void 0:n.trim())||null,ticketNumber:((c=a.get("ticketNumber"))==null?void 0:c.trim())||null};this.closeModal(),this.showLoading("Activating role...");const s=await E.activateRole(r);this.hideLoading(),s.success?(s.requiresApproval?this.showToast(`Activation request submitted for "${t}". Waiting for approval.`,"info"):this.showToast(`Role "${t}" activated successfully!`,"success"),await this.app.router.refreshCurrentPage(),this.currentTab="active"):this.showToast(`Failed to activate role: ${s.error}`,"error")}deactivateRole(e,t){const i=pt.renderConfirmDialog({title:"Deactivate Role",message:`Are you sure you want to deactivate "${t}"? You will lose access immediately and will need to reactivate if needed again.`,confirmLabel:"Deactivate Role",confirmVariant:"btn-danger",icon:"fa-stop-circle",iconColor:"warning",onConfirm:`app.pages.activations.confirmDeactivate('${e}', '${this.escapeHtml(t)}')`});this.showModal(i)}async confirmDeactivate(e,t){this.closeModal(),this.showLoading("Deactivating role...");const i=await E.deactivateRole(e);this.hideLoading(),i.success?(this.showToast(`Role "${t}" deactivated successfully`,"success"),await this.app.router.refreshCurrentPage()):this.showToast(`Failed to deactivate role: ${i.error}`,"error")}async extendActivation(e,t){this.showToast("Extension functionality coming soon","info")}calculateTimeRemaining(e){const a=new Date(e)-new Date,r=Math.floor(a/(1e3*60*60)),s=Math.floor(a%(1e3*60*60)/(1e3*60));return{hours:r,minutes:s,total:a}}formatTimeRemaining(e){return e.total<0?"Expired":e.hours===0?`${e.minutes} minutes`:e.minutes===0?`${e.hours} hour${e.hours>1?"s":""}`:`${e.hours}h ${e.minutes}m`}getPrivilegeClass(e){return{critical:"privilege-critical",high:"privilege-high",medium:"privilege-medium",low:"privilege-low"}[e]||"privilege-low"}getPrivilegeIcon(e){return{critical:"fa-skull-crossbones",high:"fa-exclamation-triangle",medium:"fa-shield-alt",low:"fa-check-circle"}[e]||"fa-check-circle"}formatPrivilegeLevel(e){return e?e.charAt(0).toUpperCase()+e.slice(1):"Low"}async refreshPage(){await this.app.router.refreshCurrentPage()}}class $l{constructor(){this.currentPage="dashboard",this.isConnected=!1,this.isConfigured=!1,this.isDarkMode=!1,this.cache={groups:null,roles:null,templates:null},this.paginators={groups:new Kt([],Ze.DEFAULT_PAGE_SIZE),roles:new Kt([],Ze.DEFAULT_PAGE_SIZE),activity:new Kt([],Ze.DEFAULT_PAGE_SIZE)},this.bulkOps={groups:new gl},this.exportUtils=Ve,this.cacheManager=new Es,this.pages={dashboard:new Cl(this),groups:new wl(this),roles:new Al(this),activity:new Tl(this),approvals:new Il(this),expiring:new kl(this),healthCheck:new El(this),coverage:new Sl(this),pimmaid:new Rl(this),baseline:new Nl(this),policies:new xl(this),templates:new Pl(this),export:new _l(this),settings:new Ml(this),activations:new Ol(this)},this.router=new yl,this.router.registerPages({dashboard:this.pages.dashboard,groups:this.pages.groups,roles:this.pages.roles,"entra-roles":this.pages.roles,"pim-activity":this.pages.activity,"pending-approvals":this.pages.approvals,"expiring-assignments":this.pages.expiring,"health-check":this.pages.healthCheck,"role-coverage":this.pages.coverage,pimmaid:this.pages.pimmaid,baseline:this.pages.baseline,policies:this.pages.policies,templates:this.pages.templates,export:this.pages.export,settings:this.pages.settings,activations:this.pages.activations,"my-activations":this.pages.activations})}async init(){if(console.log("PIMBuddy Web initializing..."),ht.initialize(),this.loadTheme(),this.isConfigured=ks(),this.isConfigured)try{await se.initialize()&&se.isAuthenticated()&&this.handleSuccessfulLogin()}catch(e){console.error("Failed to initialize auth:",e),this.showToast("Failed to initialize authentication","error")}else this.showSetupRequired();this.setupEventListeners(),this.renderPage(this.currentPage),console.log("PIMBuddy Web initialized")}setupEventListeners(){var e;document.getElementById("connect-btn").addEventListener("click",()=>this.handleConnect()),document.getElementById("theme-toggle").addEventListener("click",()=>this.toggleTheme()),document.querySelectorAll(".nav-item").forEach(t=>{t.addEventListener("click",i=>{const a=i.currentTarget.dataset.page;this.navigateTo(a)})}),(e=document.querySelector(".modal-backdrop"))==null||e.addEventListener("click",()=>this.closeModal()),document.addEventListener("keydown",t=>{t.ctrlKey&&t.key==="f"&&(t.preventDefault(),this.showGlobalSearch()),t.key==="Escape"&&this.closeModal(),t.key==="F5"&&(t.preventDefault(),this.refreshCurrentPage())})}showSetupRequired(){document.getElementById("connect-text").textContent="Setup",document.getElementById("connection-text").textContent="Setup Required"}async handleConnect(){if(!this.isConfigured){await this.showSetupWizard();return}if(this.isConnected){this.showLoading("Signing out...");const e=await se.logout();this.hideLoading(),e.success?this.handleLogout():this.showToast(e.error,"error")}else{this.showLoading("Signing in...");const e=await se.login();this.hideLoading(),e.success?this.handleSuccessfulLogin():this.showToast(e.error,"error")}}handleSuccessfulLogin(){this.isConnected=!0;const e=se.getAccount();document.getElementById("connect-text").textContent="Disconnect",document.getElementById("connect-btn").classList.remove("btn-primary"),document.getElementById("connect-btn").classList.add("btn-danger"),document.getElementById("connection-indicator").classList.remove("disconnected"),document.getElementById("connection-indicator").classList.add("connected"),document.getElementById("connection-text").textContent=(e==null?void 0:e.username)||"Connected",this.showToast("Connected successfully","success"),Oa.start(()=>{this.showToast("Session expired due to inactivity","warning"),this.handleLogout()},t=>{this.showToast(`Your session will expire in ${t} minutes due to inactivity`,"warning")}),this.refreshCurrentPage()}handleLogout(){this.isConnected=!1,this.cache={groups:null,roles:null,templates:null},Oa.stop(),document.getElementById("connect-text").textContent="Connect",document.getElementById("connect-btn").classList.remove("btn-danger"),document.getElementById("connect-btn").classList.add("btn-primary"),document.getElementById("connection-indicator").classList.remove("connected"),document.getElementById("connection-indicator").classList.add("disconnected"),document.getElementById("connection-text").textContent="Not Connected",this.showToast("Disconnected","info"),this.renderPage(this.currentPage)}async navigateTo(e,t={}){await this.router.navigateTo(e,t),this.currentPage=e}async renderPage(e,t={}){await this.router.navigateTo(e,t),ht.announcePageChange(e)}async refreshCurrentPage(){await this.router.refreshCurrentPage()}async showSetupWizard(){const e=Lt(),t=window.location.origin,i=`
            <h2><i class="fas fa-cog"></i> PIMBuddy Setup</h2>
            <p>Configure PIMBuddy to connect to your Azure AD tenant.</p>

            <div class="setup-tabs">
                <button class="setup-tab active" onclick="app.switchSetupTab('manual')">
                    <i class="fas fa-edit"></i> Manual Setup
                </button>
                <button class="setup-tab" onclick="app.switchSetupTab('instructions')">
                    <i class="fas fa-book"></i> Instructions
                </button>
            </div>

            <div id="setup-tab-manual" class="setup-tab-content active">
                <form id="manual-setup-form" onsubmit="app.saveManualConfig(event)">
                    <div class="form-group">
                        <label for="client-id">Application (Client) ID *</label>
                        <input type="text" id="client-id" class="input" required
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value="${(e==null?void 0:e.clientId)||""}"
                            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}">
                        <small class="form-hint">Found in Azure Portal → App registrations → Your app → Overview</small>
                    </div>

                    <div class="form-group">
                        <label for="tenant-id">Directory (Tenant) ID *</label>
                        <input type="text" id="tenant-id" class="input" required
                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                            value="${(e==null?void 0:e.tenantId)||""}"
                            pattern="[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}">
                        <small class="form-hint">Found in Azure Portal → Azure Active Directory → Overview</small>
                    </div>

                    <div class="setup-note">
                        <i class="fas fa-info-circle"></i>
                        <span>Your Redirect URI must be: <code>${t}</code></span>
                    </div>

                    <div id="setup-result" class="setup-result hidden"></div>

                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
                        ${e?`
                            <button type="button" class="btn btn-secondary" onclick="app.resetSetup()">
                                <i class="fas fa-trash"></i> Clear
                            </button>
                        `:""}
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save & Connect
                        </button>
                    </div>
                </form>
            </div>

            <div id="setup-tab-instructions" class="setup-tab-content">
                <div class="setup-instructions">
                    <h3>Step 1: Create App Registration</h3>
                    <ol>
                        <li>Go to <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank">Azure Portal → App registrations</a></li>
                        <li>Click <strong>New registration</strong></li>
                        <li>Name: <code>PIMBuddy Web</code></li>
                        <li>Supported account types: <strong>Single tenant</strong></li>
                        <li>Redirect URI: Select <strong>Single-page application (SPA)</strong> and enter:<br>
                            <code class="copyable" onclick="app.copyToClipboard('${t}')">${t}</code>
                        </li>
                        <li>Click <strong>Register</strong></li>
                    </ol>

                    <h3>Step 2: Configure API Permissions</h3>
                    <ol>
                        <li>In your new app, go to <strong>API permissions</strong></li>
                        <li>Click <strong>Add a permission</strong> → <strong>Microsoft Graph</strong> → <strong>Delegated permissions</strong></li>
                        <li>Add these permissions:
                            <ul class="permissions-list">
                                <li><code>User.Read</code></li>
                                <li><code>Group.Read.All</code></li>
                                <li><code>Group.ReadWrite.All</code></li>
                                <li><code>RoleManagement.Read.Directory</code></li>
                                <li><code>RoleManagement.ReadWrite.Directory</code></li>
                                <li><code>PrivilegedAccess.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedAccess.ReadWrite.AzureADGroup</code></li>
                                <li><code>PrivilegedEligibilitySchedule.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedEligibilitySchedule.ReadWrite.AzureADGroup</code></li>
                                <li><code>PrivilegedAssignmentSchedule.Read.AzureADGroup</code></li>
                                <li><code>PrivilegedAssignmentSchedule.ReadWrite.AzureADGroup</code></li>
                            </ul>
                        </li>
                        <li>Click <strong>Grant admin consent</strong> (requires admin role)</li>
                    </ol>

                    <h3>Step 3: Copy IDs</h3>
                    <ol>
                        <li>Go to <strong>Overview</strong></li>
                        <li>Copy the <strong>Application (client) ID</strong></li>
                        <li>Copy the <strong>Directory (tenant) ID</strong></li>
                        <li>Paste them in the <strong>Manual Setup</strong> tab</li>
                    </ol>
                </div>

                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Close</button>
                    <button type="button" class="btn btn-primary" onclick="app.switchSetupTab('manual')">
                        <i class="fas fa-arrow-left"></i> Back to Setup
                    </button>
                </div>
            </div>
        `;this.showModal(i)}switchSetupTab(e){document.querySelectorAll(".setup-tab").forEach(t=>t.classList.remove("active")),document.querySelectorAll(".setup-tab-content").forEach(t=>t.classList.remove("active")),document.querySelector(`.setup-tab-content#setup-tab-${e}`).classList.add("active"),event.currentTarget.classList.add("active")}copyToClipboard(e){navigator.clipboard.writeText(e).then(()=>{this.showToast("Copied to clipboard","success")}).catch(()=>{this.showToast("Failed to copy","error")})}async saveManualConfig(e){e.preventDefault();const t=document.getElementById("client-id").value.trim(),i=document.getElementById("tenant-id").value.trim(),a=document.getElementById("setup-result"),r=/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;if(!r.test(t)){a.innerHTML='<div class="error-message"><i class="fas fa-exclamation-circle"></i><div>Invalid Client ID format. Must be a GUID.</div></div>',a.classList.remove("hidden");return}if(!r.test(i)){a.innerHTML='<div class="error-message"><i class="fas fa-exclamation-circle"></i><div>Invalid Tenant ID format. Must be a GUID.</div></div>',a.classList.remove("hidden");return}const s={clientId:t,tenantId:i,createdAt:new Date().toISOString()};localStorage.setItem("pimbuddy-app-config",JSON.stringify(s)),this.isConfigured=!0;try{await se.reinitialize(),a.innerHTML=`
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <strong>Configuration saved!</strong>
                        <p>Click below to sign in.</p>
                    </div>
                </div>
            `,a.classList.remove("hidden"),document.getElementById("connect-text").textContent="Connect",document.getElementById("connection-text").textContent="Not Connected",setTimeout(async()=>{this.closeModal(),await this.handleConnect()},1e3)}catch(n){a.innerHTML=`
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <strong>Configuration Error</strong>
                        <p>${n.message}</p>
                    </div>
                </div>
            `,a.classList.remove("hidden")}}async resetSetup(){confirm("This will clear the saved configuration. You will need to run setup again. Continue?")&&(nl(),this.isConfigured=!1,se.msalInstance=null,se.account=null,se.initialized=!1,this.closeModal(),this.showToast("Configuration cleared","info"),this.showSetupRequired(),this.renderPage(this.currentPage))}renderLandingPage(e){e.innerHTML=`
            <!-- Hero Section -->
            <div style="text-align: center; padding: var(--space-xl) 0; max-width: 1200px; margin: 0 auto;">
                <div style="display: inline-flex; align-items: center; justify-content: center; width: 120px; height: 120px; background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border-radius: 30px; margin-bottom: var(--space-lg); box-shadow: 0 20px 60px rgba(0, 212, 170, 0.3);">
                    <i class="fas fa-shield-alt" style="font-size: 4rem; color: var(--accent-primary);"></i>
                </div>

                <h1 style="font-family: var(--font-display); font-size: 3.5rem; font-weight: 800; margin-bottom: var(--space-md); background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                    Welcome to PIMBuddy
                </h1>

                <p style="font-size: 1.3rem; color: var(--text-secondary); max-width: 700px; margin: 0 auto var(--space-xl);">
                    Your complete solution for Microsoft Entra PIM management. Deploy, monitor, and secure privileged access with enterprise-grade tools.
                </p>

                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.1rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);">
                    <i class="fas fa-plug"></i> Connect to Get Started
                </button>
            </div>

            <!-- Key Stats -->
            <div class="stats-grid" style="margin-bottom: var(--space-xl);">
                <div class="card stat-card" style="border-color: var(--accent-primary-dim);">
                    <div class="stat-icon primary">
                        <i class="fas fa-tachometer-alt"></i>
                    </div>
                    <div class="stat-value">5</div>
                    <div class="stat-label">Monitoring Tools</div>
                </div>
                <div class="card stat-card" style="border-color: var(--accent-secondary-dim);">
                    <div class="stat-icon secondary">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <div class="stat-value">3</div>
                    <div class="stat-label">Baseline Templates</div>
                </div>
                <div class="card stat-card" style="border-color: var(--color-success-dim);">
                    <div class="stat-icon success">
                        <i class="fas fa-shield-check"></i>
                    </div>
                    <div class="stat-value">100%</div>
                    <div class="stat-label">Zero Trust Ready</div>
                </div>
            </div>

            <!-- Core Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-stars" style="color: var(--accent-primary);"></i> Core Features
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- Baseline Deployment -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-primary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-primary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-rocket" style="font-size: 1.8rem; color: var(--accent-primary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Baseline Deployment</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">One-Click PIM Setup</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Deploy complete PIM configurations instantly with industry best practices. Choose from Enterprise Standard, High Security (Zero Trust), or Quick Start templates.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-primary"><i class="fas fa-check"></i> Tiered Access (T0/T1/T2)</span>
                        <span class="badge badge-success"><i class="fas fa-check"></i> MFA Required</span>
                        <span class="badge badge-info"><i class="fas fa-check"></i> Approval Workflows</span>
                        <span class="badge badge-warning"><i class="fas fa-check"></i> Auto-Configuration</span>
                    </div>
                </div>

                <!-- PIM Health Check -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-success-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-success-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-heart-pulse" style="font-size: 1.8rem; color: var(--color-success);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Health Check Scanner</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Security Analysis</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Automated security scanner that analyzes your PIM configuration. Get a health score (0-100%) and actionable recommendations to improve security.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-search"></i> Auto-Scan</span>
                        <span class="badge badge-primary"><i class="fas fa-chart-line"></i> Health Score</span>
                        <span class="badge badge-warning"><i class="fas fa-exclamation-triangle"></i> Issue Detection</span>
                        <span class="badge badge-info"><i class="fas fa-lightbulb"></i> Recommendations</span>
                    </div>
                </div>

                <!-- Activity Monitoring -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--accent-secondary-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--accent-secondary-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-history" style="font-size: 1.8rem; color: var(--accent-secondary);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">PIM Activity Log</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Audit & Compliance</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Complete audit trail of all PIM role management activities. Track who did what, when, and why with detailed activity logs and filtering.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-secondary"><i class="fas fa-calendar"></i> 30-Day History</span>
                        <span class="badge badge-info"><i class="fas fa-filter"></i> Advanced Filtering</span>
                        <span class="badge badge-primary"><i class="fas fa-download"></i> Export Logs</span>
                    </div>
                </div>

                <!-- Approval Management -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid var(--color-warning-dim);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-clock" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Pending Approvals</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Request Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Manage PIM activation requests in one place. Review justifications, approve or deny requests, and maintain compliance with one-click actions.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-success"><i class="fas fa-check"></i> Quick Approve</span>
                        <span class="badge badge-danger"><i class="fas fa-times"></i> Quick Deny</span>
                        <span class="badge badge-info"><i class="fas fa-comment"></i> Justification View</span>
                    </div>
                </div>

                <!-- Expiring Assignments -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(245, 158, 11, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: var(--color-warning-dim); border-radius: var(--radius-lg);">
                            <i class="fas fa-hourglass-end" style="font-size: 1.8rem; color: var(--color-warning);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Expiring Assignments</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Lifecycle Management</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Track role assignments expiring within 7 days. Proactive monitoring prevents access loss and ensures continuous operations.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-warning"><i class="fas fa-bell"></i> 7-Day Alerts</span>
                        <span class="badge badge-primary"><i class="fas fa-clock"></i> Time Remaining</span>
                        <span class="badge badge-info"><i class="fas fa-list"></i> Full Tracking</span>
                    </div>
                </div>

                <!-- Role Coverage -->
                <div class="card" style="background: linear-gradient(135deg, var(--bg-elevated), var(--bg-surface)); border: 1px solid rgba(59, 130, 246, 0.2);">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md);">
                        <div style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; background: rgba(59, 130, 246, 0.15); border-radius: var(--radius-lg);">
                            <i class="fas fa-chart-pie" style="font-size: 1.8rem; color: var(--color-info);"></i>
                        </div>
                        <div>
                            <h3 style="font-size: 1.3rem; font-weight: 700; margin: 0;">Role Coverage Report</h3>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Analytics Dashboard</p>
                        </div>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-md);">
                        Analyze which roles are managed through PIM groups vs direct assignments. Visual reports help identify gaps and improve governance.
                    </p>
                    <div style="display: flex; flex-wrap: wrap; gap: var(--space-xs);">
                        <span class="badge badge-info"><i class="fas fa-chart-pie"></i> Visual Reports</span>
                        <span class="badge badge-primary"><i class="fas fa-percent"></i> Coverage %</span>
                        <span class="badge badge-warning"><i class="fas fa-flag"></i> Gap Analysis</span>
                    </div>
                </div>
            </div>

            <!-- Additional Features -->
            <h2 style="font-family: var(--font-display); font-size: 2rem; font-weight: 700; text-align: center; margin-bottom: var(--space-lg);">
                <i class="fas fa-toolbox" style="color: var(--accent-primary);"></i> Additional Tools
            </h2>

            <div class="dashboard-grid" style="margin-bottom: var(--space-xl);">
                <!-- PIMMaid -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon primary">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">PIMMaid Visualizer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export your PIM configuration as beautiful Mermaid diagrams. Visualize relationships between users, groups, and roles.
                    </p>
                    <span class="badge badge-secondary"><i class="fas fa-sitemap"></i> Visual Diagrams</span>
                </div>

                <!-- Group Management -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon success">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Group Management</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Create and manage role-assignable security groups. Add/remove members with an intuitive interface.
                    </p>
                    <span class="badge badge-success"><i class="fas fa-user-plus"></i> Member Management</span>
                </div>

                <!-- Role Explorer -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon warning">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Entra Roles Explorer</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Browse all Azure AD roles with privilege levels. Search, filter, and understand role permissions.
                    </p>
                    <span class="badge badge-warning"><i class="fas fa-shield-alt"></i> Privilege Levels</span>
                </div>

                <!-- Import/Export -->
                <div class="card">
                    <div style="display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-sm);">
                        <div class="stat-icon info">
                            <i class="fas fa-file-export"></i>
                        </div>
                        <h3 style="font-size: 1.2rem; font-weight: 700; margin: 0;">Import/Export</h3>
                    </div>
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">
                        Export configurations for backup or compliance. Import templates to replicate setups across tenants.
                    </p>
                    <span class="badge badge-info"><i class="fas fa-download"></i> Backup & Restore</span>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="card" style="background: linear-gradient(135deg, var(--accent-primary-dim), var(--accent-secondary-dim)); border: 2px solid var(--accent-primary); text-align: center; padding: var(--space-xl);">
                <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Ready to Transform Your PIM Management?
                </h2>
                <p style="font-size: 1.1rem; color: var(--text-secondary); margin-bottom: var(--space-lg); max-width: 600px; margin-left: auto; margin-right: auto;">
                    Connect to your Microsoft Entra ID tenant and start managing privileged access with enterprise-grade tools in minutes.
                </p>
                <button class="btn btn-primary" onclick="document.getElementById('connect-btn').click()" style="font-size: 1.2rem; padding: var(--space-md) var(--space-xl); box-shadow: 0 10px 30px rgba(0, 212, 170, 0.4);">
                    <i class="fas fa-plug"></i> Connect Now
                </button>
            </div>

            <!-- Footer Info -->
            <div style="text-align: center; margin-top: var(--space-xl); padding: var(--space-lg); color: var(--text-muted);">
                <p style="margin-bottom: var(--space-sm);">
                    <i class="fas fa-shield-check" style="color: var(--accent-primary);"></i>
                    Built with enterprise security in mind
                </p>
                <p style="font-size: 0.9rem;">
                    PIMBuddy v1.0.0 | Powered by Microsoft Graph API | Zero Trust Ready
                </p>
            </div>
        `}sortRolesByPrivilege(e,t){const i={critical:0,high:1,medium:2,low:3};return[...e].sort((a,r)=>t==="privilege-desc"?i[a.privilegeLevel]-i[r.privilegeLevel]:t==="privilege-asc"?i[r.privilegeLevel]-i[a.privilegeLevel]:t==="name-asc"?a.displayName.localeCompare(r.displayName):t==="name-desc"?r.displayName.localeCompare(a.displayName):0)}sortRoles(e){e==="privilege"?e=this.roleSortOrder==="privilege-desc"?"privilege-asc":"privilege-desc":e==="name"&&(e=this.roleSortOrder==="name-asc"?"name-desc":"name-asc"),this.roleSortOrder=e,this.renderPage("roles")}handleActivityPageChange(e){this.paginators.activity.goToPage(e),this.renderPage("pim-activity")}handleActivityPageSizeChange(e){this.paginators.activity.setPageSize(e),this.renderPage("pim-activity")}showGlobalSearch(){this.showToast("Global search coming soon","info")}exportActivityToCSV(){try{const e=this.paginators.activity.allItems||[];if(e.length===0){this.showToast("No activity logs to export","warning");return}const t=Ve.generateFilename("pim-activity");Ve.exportToCSV(e,t,pl.activity.columns),this.showToast(`Exported ${e.length} activity logs to CSV`,"success")}catch(e){this.showToast(`Export failed: ${e.message}`,"error")}}exportActivityToJSON(){try{const e=this.paginators.activity.allItems||[];if(e.length===0){this.showToast("No activity logs to export","warning");return}const t=Ve.generateFilename("pim-activity");Ve.exportToJSON(e,t),this.showToast(`Exported ${e.length} activity logs to JSON`,"success")}catch(e){this.showToast(`Export failed: ${e.message}`,"error")}}showExportMenu(e){const t=`
            <div style="text-align: center; padding: var(--space-xl);">
                <div style="width: 80px; height: 80px; margin: 0 auto var(--space-lg); background: var(--accent-primary-dim); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-file-export" style="font-size: 2.5rem; color: var(--accent-primary);"></i>
                </div>

                <h2 style="font-family: var(--font-display); font-size: 1.5rem; font-weight: 800; margin-bottom: var(--space-md);">
                    Export ${e.charAt(0).toUpperCase()+e.slice(1)}
                </h2>

                <p style="font-family: var(--font-mono); font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-xl);">
                    Choose your preferred export format
                </p>

                <div style="display: flex; flex-direction: column; gap: var(--space-md); max-width: 400px; margin: 0 auto;">
                    <button class="btn btn-primary" onclick="app.export${e.charAt(0).toUpperCase()+e.slice(1)}ToCSV(); app.closeModal();" style="justify-content: center; font-family: var(--font-mono); padding: var(--space-md);">
                        <i class="fas fa-file-csv"></i> Export as CSV
                        <span style="font-size: 0.75rem; opacity: 0.7; margin-left: auto;">Spreadsheet compatible</span>
                    </button>

                    <button class="btn btn-secondary" onclick="app.export${e.charAt(0).toUpperCase()+e.slice(1)}ToJSON(); app.closeModal();" style="justify-content: center; font-family: var(--font-mono); padding: var(--space-md);">
                        <i class="fas fa-file-code"></i> Export as JSON
                        <span style="font-size: 0.75rem; opacity: 0.7; margin-left: auto;">Developer friendly</span>
                    </button>
                </div>

                <button class="btn btn-secondary btn-sm" onclick="app.closeModal()" style="margin-top: var(--space-xl); font-family: var(--font-mono);">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;this.showModal(t)}async applyTemplateToRole(e){const t=Xe.getAllTemplates(),i=`
            <h2><i class="fas fa-copy"></i> Apply Template to Role</h2>
            <p>Select a template to apply its settings to this role's PIM policy.</p>

            <div class="template-select-list">
                ${Object.values(t).map(a=>`
                    <div class="template-select-item" onclick="app.executeApplyTemplateToRole('${e}', '${a.id}')">
                        <div class="template-icon ${a.color||"primary"}">
                            <i class="fas ${a.icon}"></i>
                        </div>
                        <div class="template-info">
                            <strong>${this.escapeHtml(a.name)}</strong>
                            <span>${a.settings.activation.maximumDurationHours}h | MFA: ${a.settings.activation.requireMfa?"Yes":"No"} | Approval: ${a.settings.activation.requireApproval?"Yes":"No"}</span>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div class="modal-actions">
                <button type="button" class="btn btn-secondary" onclick="app.closeModal()">Cancel</button>
            </div>
        `;this.showModal(i)}async executeApplyTemplateToRole(e,t){var r;const i=Xe.getTemplate(t);if(!i){this.showToast("Template not found","error");return}this.closeModal(),this.showLoading("Applying template...");const a=await E.updateRolePolicy(e,{maximumDurationHours:i.settings.activation.maximumDurationHours,requireMfa:i.settings.activation.requireMfa,requireJustification:i.settings.activation.requireJustification,requireTicketInfo:i.settings.activation.requireTicketInfo,requireApproval:i.settings.activation.requireApproval});if(this.hideLoading(),a.success){this.showToast("Template applied successfully","success");const s=(r=document.querySelector(".policy-editor h2"))==null?void 0:r.textContent;s&&await this.selectRoleForPolicy(e,s)}else this.showToast(a.error,"error")}exportConfig(){this.showToast("Export coming soon","info")}handleImport(e){e.length>0&&this.showToast(`Selected file: ${e[0].name}`,"info")}showLoading(e="Loading..."){document.getElementById("loading-text").textContent=e,document.getElementById("loading-overlay").classList.remove("hidden"),ht.announceLoading(!0,e)}hideLoading(){document.getElementById("loading-overlay").classList.add("hidden"),ht.announceLoading(!1)}showToast(e,t="info"){const i=document.getElementById("toast-container"),a=document.createElement("div");a.className=`toast toast-${t}`,a.innerHTML=`
            <i class="fas fa-${t==="success"?"check-circle":t==="error"?"exclamation-circle":"info-circle"}"></i>
            <span>${this.escapeHtml(e)}</span>
        `,i.appendChild(a),setTimeout(()=>{a.classList.add("fade-out"),setTimeout(()=>a.remove(),300)},3e3)}showModal(e){document.getElementById("modal-content").innerHTML=e,document.getElementById("modal-container").classList.remove("hidden")}closeModal(){document.getElementById("modal-container").classList.add("hidden")}toggleTheme(){this.isDarkMode=!this.isDarkMode,this.applyTheme(),localStorage.setItem("pimbuddy-theme",this.isDarkMode?"dark":"light")}setTheme(e){this.isDarkMode=e==="dark",this.applyTheme(),localStorage.setItem("pimbuddy-theme",e)}loadTheme(){const e=localStorage.getItem("pimbuddy-theme");this.isDarkMode=e!=="light",this.applyTheme()}applyTheme(){document.body.classList.toggle("dark-mode",this.isDarkMode);const e=document.querySelector("#theme-toggle i");e&&(e.className=this.isDarkMode?"fas fa-sun":"fas fa-moon")}escapeHtml(e){return H.escapeHtml(e)}}const Ss=new $l;window.app=Ss;Ss.init();
//# sourceMappingURL=index-B1Kozwx9.js.map
