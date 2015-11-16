var path = require( 'path' );
var fs = require( 'fs' );
var mkdirp = require( 'mkdirp' );

/**
 * 是不是目录
 * @param path
 */
function isDir ( path ) {
    return fs.lstatSync( path ).isDirectory();
}

/**
 * 获取依赖源目录
 */
function getTargetPath() {
    return path.join(
        arguments[ 1 ],
        arguments[ 0 ].replace( arguments[ 2 ], '' )
    );
}

/**
 * 某个文件的copy操作
 * @param tarPath
 * @param f
 */
function makeModify( tarPath, f ) {
    cp( '-f', f, path.dirname( tarPath ) );
}

/**
 * 同步操作
 * @type {{new: Function, remove: Function, cp: Function}}
 */
module.exports = {

    /**
     * 新建文件或者文件夹
     * @param f 实际变动的文件
     * @param srcpath 依赖源路径
     * @param destpath 依赖目标路径
     */
    new: function ( f, srcpath, destpath ) {
        var tarPath = getTargetPath.apply( null, arguments );
        if ( isDir( f ) ) return mkdirp.sync( tarPath );
        // file
        makeModify( tarPath, f );
    },

    remove: function ( f, srcpath, destpath ) {
        var tarPath = getTargetPath.apply( null, arguments );
        // TODO: 为了安全开发，暂时去掉删除文件的同步操作，因为很有可能会误删
    },

    modify: function ( f, srcpath, destpath ) {
        var tarPath = getTargetPath.apply( null, arguments );
        makeModify( tarPath, f );
    }

};