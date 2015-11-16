/**
 * 工具
 * @type {{platform: {darwin: string, win32: string}, cleardeppath: Function}}
 */

module.exports = {

    mark: {
        watching: '.watchingignore',
        gitignore: '.gitignore'
    },

    platform: {
        darwin: 'darwin',
        win32: 'win32'
    },

    cleardeppath: function ( dep ) {

        return dep.substring( ~ dep.indexOf( '/' )
            ? ( dep.indexOf( '/' ) + 1 ) : 0 );

    }

};