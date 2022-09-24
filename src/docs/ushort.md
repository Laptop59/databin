# UShort
A ushort is a unsigned numeric tag DataBin has. It has a id of `0x0a`. It can store from `0` to `65535`.

<Image src="UShortIcon"/><br/>

<sub><sup><span style="color:#9b9f1f;">An unsigned short</span></sup></sub>

It occupies 2 bytes in value.
It also has a <Link href=".DataBin.Tags.Standard.Short">signed</Link> version.

## How it's stored
```
Bytes:
<0x0a> <name...> <0x00> <value / 256> <value % 256>
```