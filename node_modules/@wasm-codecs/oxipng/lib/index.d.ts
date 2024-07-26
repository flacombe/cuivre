/// <reference types="node" />
import { EncodeOptions } from './types';
/**
 * Encode a raw input image using oxipng
 *
 * @param {Buffer} image Raw image input buffer
 * @param {EncodeOptions} encodeOptions Encoding options passed to oxipng
 * @returns {Buffer} Processed image buffer
 */
declare const encode: (image: Buffer, encodeOptions?: EncodeOptions) => Buffer;
export default encode;
