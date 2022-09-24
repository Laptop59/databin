# UInteger
An uinteger (also called `uint`) is a unsigned numeric tag DataBin has. It has a id of `0x0b`. It can store from `0` to `4294967295` (`2^32-1`).

<Image src="UIntIcon"/><br/>

<sub><sup><span style="color:#1b1f9f;">An unsigned integer</span></sup></sub>

It occupies 4 bytes in value.
It also has a <Link href=".DataBin.Tags.Standard.Integer">signed</Link> version.

## How it's stored
```
Bytes:
<0x0b> <name...> <0x00> <value...>
```