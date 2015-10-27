/**
 * 自定义参数提示
 * @param argv
 * @param fis
 * @returns {boolean}
 */
module.exports = function ( argv, fis ) {

    if ( argv[ 'V' ] ) {

        var packinfo = fis.util.readJson( '../package.json' );

        console.log( 'fis3-wrapper-common version:' + packinfo.version );

        return true;
    }

    return false;

}