# ULong
A ulong is a unsigned numeric tag DataBin has. It has a id of `0x0c`. It can store from `0` to `18446744073709551615` (`2^64-1`).

<Image src="ULongIcon"/><br/>

<sub><sup><span style="color:#1b9f9f;">An unsigned long</span></sup></sub>

It occupies 8 bytes in value.
It also has a <Link href=".DataBin.Tags.Standard.Long">signed</Link> version.

## How it's stored
```
Bytes:
<0x0c> <name...> <0x00> <value...>
```