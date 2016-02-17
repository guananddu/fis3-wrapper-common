// 常规配置

var path = require( 'path' );

// 先读取用户配置
require( global.fisConfPath );

// 当前项目的实际路径【文件夹具体路径】
var CURR_PROJECT_DIR = process.cwd();
// 当前项目的名称
var CURR_PROJECT = path.basename( CURR_PROJECT_DIR );

// 静态资源前缀
var STATIC_PREFIX = fis.config.get( 'build.staticPrefix' )
    || path.join( 'resource', CURR_PROJECT );
// 模板资源前缀
var TPL_PREFIX = fis.config.get( 'build.tplPrefix' )
    || path.join( 'template', CURR_PROJECT );

// 静态资源的发布目录
var STATIC_TARGET = STATIC_PREFIX + '$0';
// django模板的发布目录
var TPL_TARGET = TPL_PREFIX + '$0';

// 依赖
var PRO_DEPS = fis.config.get( 'project.dependencies' ) || [ ];

try {
    // 远程发布设置
    var REMOTE_TARGET_MAP = require(
        path.join( CURR_PROJECT_DIR, 'fis-remote-conf' ) );
} catch ( e ) {
    // console.error( 'You can create `fis-remote-conf.js` to define remote targets.' );
}

var STATIC_DOMAIN = fis.config.get( 'build.staticDomain' ) || [
    'http://s0.pstatp.com',
    'http://s2.pstatp.com'
];

var PAGELET_SCRIPT_TAG = fis.config.get( 'build.pageletScriptTag' )
    || '<!-- PAGELET_SCRIPT -->';
var PAGELET_STYLE_TAG = fis.config.get( 'build.pageletStyleTag' )
    || '<!-- PAGELET_STYLE -->';

//------------------------------以下配置针对通用配置---------------------------------//

// 静态资源构建目标目录
fis.match( '*', {
    release: STATIC_TARGET
} );

// 模板
fis.match( '*.html', {
    parser: [
        STATIC_PATH_REPLACE,
        REQUIRE_ROOT_REPLACE,
        TEMPLATE_REPLACE,
        fis.plugin( 'pagelet', {
            scriptTag: PAGELET_SCRIPT_TAG,
            styleTag: PAGELET_STYLE_TAG
        } )
    ],
    // 测试htmlmin
    //optimizer: [
    //    fis.plugin( 'htmlmin', {
    //        jsmin: false,
    //        removeComments: true,
    //        collapseWhitespace: true
    //    } )
    //],
    release: TPL_TARGET
} );

// css
fis.match( '*.css', {
    parser: [
         STATIC_PATH_REPLACE
    ],
    postprocessor: fis.plugin( 'autoprefixer-6.x', {
        browsers: [
            'iOS >= 6',
            'Android >= 4',
            'ChromeAndroid >= 40'
        ]
    } )
} );

// js
fis.match( '*.js', {
    parser: [
         STATIC_PATH_REPLACE
    ]
} );

// 启用 es6 插件，解析 .es6 后缀为 .js
fis.match( '*.es6', {
    rExt: '.js',
    parser: [
        // STATIC_PATH_REPLACE,
        fis.plugin( 'es6' )
    ]
} );

// 前端模板解析【需要在页面中手动引入handlebars的库文件】
fis.match( '*.hmpl', {
    rExt: '.js',
    parser: fis.plugin( 'handlebars-4.x' ),
    release: false
} );

// 测试underscore template
fis.match( '*.tmpl', {
    rExt: '.js',
    parser: fis.plugin( 'undertpl' ),
    release: false
} );

// less【less中的import指令，最好使用相对路径来引用】
fis.match( '*.less', {
    rExt: '.css', // from .less to .css
    parser: [
        STATIC_PATH_REPLACE,
        fis.plugin( 'less-2.5.x' )
    ],
    postprocessor: fis.plugin( 'autoprefixer-6.x', {
        browsers: [
            'iOS >= 6',
            'Android >= 4',
            'ChromeAndroid >= 40'
        ]
    } )
} );

fis.match( '*.scss', {
    rExt: '.css', // from .less to .css
    parser: [
        STATIC_PATH_REPLACE,
        fis.plugin( 'node-sass' )
    ],
    postprocessor: fis.plugin( 'autoprefixer-6.x', {
        browsers: [
            'iOS >= 6',
            'Android >= 4',
            'ChromeAndroid >= 40'
        ]
    } )
} );

fis.match( '*.{js,less,scss,css,png,jpg,jpeg,gif,es6}', {
    useHash: true,
    domain: STATIC_DOMAIN
} );

fis.hook( 'amd' );

fis.match( '/{widget,pagelet}/**/*.js', {
    isMod: true
} );

fis.match( '/{widget,pagelet}/**/*.js', {
    postprocessor: fis.plugin( 'jswrapper', {
        type: 'amd'
    } )
} );

fis.match( '/tt_common/{widget,pagelet}/**/*.js', {
    isMod: true
} );

fis.match( '/tt_common/{widget,pagelet}/**/*.js', {
    postprocessor: fis.plugin( 'jswrapper', {
        type: 'amd'
    } )
} );

//------------------------------以下配置针对online部署---------------------------------//

fis.media( 'online' ).match( '*.{less,scss,css}', {
    optimizer: fis.plugin( 'clean-css' )
} );

fis.media( 'online' ).match( '*.{js,es6,tmpl,hmpl}', {
    optimizer: fis.plugin( 'uglify-js' )
} );

/* 以下两处为上线路径配置 */

// 静态资源
fis.media( 'online' ).match( '*', {
    release: path.join( 'webroot', STATIC_TARGET ),
    url : path.join( '/', STATIC_TARGET )
} );

// 模板
fis.media( 'online' ).match( '*.html', {
    release: path.join( 'djangosite/templates', TPL_TARGET )
} );

//------------------------------以下配置针对newol部署---------------------------------//

fis.media( 'newol' ).match( '*.{less,scss,css}', {
    optimizer: fis.plugin( 'clean-css' )
} );

fis.media( 'newol' ).match( '*.{js,es6,tmpl,hmpl}', {
    optimizer: fis.plugin( 'uglify-js' )
} );

/* 以下两处为上线路径配置 */

// 静态资源
fis.media( 'newol' ).match( '*', {
    release: path.join( '', STATIC_TARGET ),
    url : path.join( '/', STATIC_TARGET )
} );

// 模板
fis.media( 'newol' ).match( '*.html', {
    release: path.join( '', TPL_TARGET )
} );

//------------------------------以下配置针对/opt/tiger/toutiao部署---------------------------------//

fis.media( 'toutiao' ).match( '*.{less,scss,css}', {
    optimizer: fis.plugin( 'clean-css' )
} );

fis.media( 'toutiao' ).match( '*.{js,es6,tmpl,hmpl}', {
    optimizer: fis.plugin( 'uglify-js' )
} );

/* 以下两处为上线路径配置 */

// 静态资源
fis.media( 'toutiao' ).match( '*', {
    release: path.join( 'webroot', STATIC_TARGET ),
    url : path.join( '/', STATIC_TARGET )
} );

// 模板
fis.media( 'toutiao' ).match( '*.html', {
    release: path.join( 'templates', TPL_TARGET )
} );

//------------------------------以下配置针对default-online---------------------------------//

fis.media( 'default-online' ).match( '*.{less,scss,css}', {
    optimizer: fis.plugin( 'clean-css' )
} );

fis.media( 'default-online' ).match( '*.{js,es6,tmpl,hmpl}', {
    optimizer: fis.plugin( 'uglify-js' )
} );

/* 以下两处为上线路径配置 */

// 静态资源
fis.media( 'default-online' ).match( '*', {
    release: path.join( '', STATIC_TARGET ),
    url : path.join( '/', STATIC_TARGET )
} );

// 模板
fis.media( 'default-online' ).match( '*.html', {
    release: path.join( '', TPL_TARGET )
} );

//------------------------------以下配置针对local调试---------------------------------//

// 静态资源
fis.media( 'local' ).match( '*', {
    release: '$0'
} );

// 模板
fis.media( 'local' ).match( '*.html', {
    parser: [
        DJANGO_SPECIAL_REPLACE,
        STATIC_PATH_REPLACE,
        REQUIRE_ROOT_REPLACE_4LOCAL,
        TEMPLATE_REPLACE_4LOCAL,
        fis.plugin( 'pagelet', {
            scriptTag: PAGELET_SCRIPT_TAG,
            styleTag: PAGELET_STYLE_TAG
        } )
    ],
    release: '$0'
} );

fis.media( 'local' ).match( '*.{js,less,scss,css,png,jpg,jpeg,gif,es6}', {
    useHash: false,
    domain: null
} );

//-----------------------------针对Django解析的local调试【测试阶段】------------------------------//

// 需要注册django母模板的模板【在这里注册以后，在发布时这几个文件就会被编译成纯粹的html】
var djangoExportTpl = [
    '{',
        '/page/index/recommend4dj.html',
    '}'
].join( ',' );

fis.media( 'dlocal' ).match( djangoExportTpl, {
    extras: {
        django: true
    }
} );

fis.media( 'dlocal' ).match( '*', {
    release: '$0'
} );

// 在local的情况下调试，才会调用django的mock数据
fis.media( 'dlocal' ).match( '*.html', {
    parser: [
        DJANGO_SPECIAL_REPLACE,
        STATIC_PATH_REPLACE,
        REQUIRE_ROOT_REPLACE_4LOCAL,
        DJANGO_REPLACE,
        fis.plugin( 'pagelet', {
            scriptTag: PAGELET_SCRIPT_TAG,
            styleTag: PAGELET_STYLE_TAG
        } )
    ],
    // 调起django插件
    postprocessor: [ fis.plugin( 'html-django' ) ],
    release: '/$0'
} );

fis.media( 'dlocal' ).match( '*.{js,less,scss,css,png,jpg,jpeg,gif,es6}', {
    useHash: false,
    domain: null
} );

//-----------------------------map.json------------------------------//

fis.match( '/map.json', {
    release: '/config/$0'
} );

//------------------------------远程发布设置-----------------------------//

for ( var username in REMOTE_TARGET_MAP ) {
    ( function ( username ) {
        var cur = REMOTE_TARGET_MAP[ username ];
        var rec = cur.receiver;
        for ( var selector in cur.deploy ) {
            fis.media( username ).match( selector, {
                deploy: fis.plugin( 'http-push', {
                    receiver: rec,
                    to: cur.deploy[ selector ]
                } )
            } );
            fis.media( username ).match( '*.{js,less,scss,css,png,jpg,jpeg,gif,es6}', {
               useHash: false,
               domain: null
            } );
        }
    } )( username );
}

//------------------------------忽略项-------------------------- -------//

// 设置忽略项
fis.set( 'project.ignore',
    fis.get( 'project.ignore' ).concat( [
        '/config/**',
        'fis-conf.js',
        'fis-remote-conf.js',
        '/*.md',
        '/*.txt',
        '/**/*.md',
        '/**/*.txt',
        '/.watchingignore',
        'online-conf',
        'node_modules'
    ] ) );

//-----------------------------特殊标记替换函数--------------------------//

// 针对跨项目依赖的被引用项目的路径依赖问题
var DEPS = function() {
    var res = [ ];
    var map = { };
    PRO_DEPS.map( function( el ) {
        var item = el.split( '/' )[ 1 ];
        !map[ item ] && res.push( item );
    } );
    return res;
}();

var DEPS_STATIC_PATHREG = fis.config.get( 'build.depsStaticPathReg' )
    || /(static\/|page\/|pagelet\/|widget\/)/g;

// 静态资源路径
function STATIC_PATH_REPLACE ( content, file, settings ) {
    var curdeppro = file.id.split( '/' )[ 0 ];
    // 防止combone.js文件被CDN缓存
    content = content
        .replace( /__RESOURCE_MAP_CREATE_TIMESTAMP__/g, (new Date).getTime() )
        .replace( /\[\[curresroot\]\]/ig, path.join( '/', curdeppro ) );
    if ( !~ DEPS.indexOf( curdeppro ) ) return content;

    return content
        .replace( /\[\[tplroot\]\]/g, '[[curtplroot]]' )
        .replace( DEPS_STATIC_PATHREG,
            curdeppro + '/\$1' );
};

// 针对实际发布的模板路径
function TEMPLATE_REPLACE ( content, file, settings ) {
    var curdeppro = file.id.split( '/' )[ 0 ];
    return content
        /* for online or remote */
        .replace( /\[\[tplroot\]\]/ig, TPL_PREFIX )
        .replace( /\[\[curtplroot\]\]/ig,
            path.join( TPL_PREFIX ) );
};

function TEMPLATE_REPLACE_4LOCAL ( content, file, settings ) {
    var curdeppro = file.id.split( '/' )[ 0 ];
    return content
        /* for local */
        .replace( /\[\[tplroot\]\]\//ig, '' )
        .replace( /\[\[curtplroot\]\]\//ig,
            // path.join( curdeppro, '/' )
            ''
    );
};

// 以下函数做requireroot的替换
function REQUIRE_ROOT_REPLACE( content, file, settings ) {
    var curdeppro = file.id.split( '/' )[ 0 ];
    return content
        .replace( /\[\[requireroot\]\]/ig, STATIC_PREFIX );
}

function REQUIRE_ROOT_REPLACE_4LOCAL ( content, file, settings ) {
    var curdeppro = file.id.split( '/' )[ 0 ];
    return content
        .replace( /\[\[requireroot\]\]/ig, '/' );
}

// 针对local模式的django模板路径
function DJANGO_REPLACE ( content, file, settings ) {
    var curdeppro = file.id.split( '/' )[ 0 ];
    // 默认django模板在local模式下，模板根目录是当前项目的上一级目录
    return content
        .replace( /\[\[tplroot\]\]/ig, CURR_PROJECT )
        .replace( /\[\[curtplroot\]\]/ig,
            CURR_PROJECT + '/' + curdeppro );
};

// 针对django模板中的特殊标记的替换
var DJANGO_SPECIAL_PATTERNS = [
    // {% load jsonify from common_utils %}
    {
        pattern: /\{\%\s*load\s+([^\%\}]+)\%\}/g,
        replace: ''
    },
    // {% static_url 'inapp/TTAdblock.js' %}
    {
        pattern: /\{\%\s*static_url\s+((['"])([^'"\%\}]+)\2)\s*\%\}/g,
        replace: 'http://s2.pstatp.com/$3'
    },
    // jsonify
    {
        pattern: /\|(jsonify|to_local_web|datetime2_chinese_day)/g,
        replace: ''
    },
    // |highlight:datum.tokens}}
    {
        pattern: /\|highlight\:.+\}\}/g,
        replace: '}}'
    }
];

var UD_DJANGO_SPECIAL_PATTERNS =
    fis.config.get( 'build.djangoSpecialTags' ) || [ ];

DJANGO_SPECIAL_PATTERNS = DJANGO_SPECIAL_PATTERNS.concat(
    UD_DJANGO_SPECIAL_PATTERNS );

function DJANGO_SPECIAL_REPLACE( content, file, settings ) {
    var innerRep = function ( content ) {
        DJANGO_SPECIAL_PATTERNS.map( function ( el ) {
            content = content.replace( el.pattern, el.replace );
        } );
        return content;
    };
    return innerRep( content );
}

// 最后再读取用户配置【用户配置为准】
// require( global.fisConfPath );

function o () {
    return console.log.apply( console, arguments );
}