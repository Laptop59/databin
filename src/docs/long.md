# Long
A long is a numeric tag DataBin has. It has a id of `0x05`. It can store from `-9223372036854775808` (`-2^63`) to `9223372036854775807` (`2^63-1`).

<Image src="LongIcon"/><br/>

<sub><sup><span style="color:#1b9f9f;">A long</span></sup></sub>

It occupies 8 bytes in value.
It also has an <Link href=".DataBin.Tags.Standard.ULong">unsigned</Link> version.

## How it's stored
```
Bytes:
<0x05> <name...> <0x00> <value...>
```