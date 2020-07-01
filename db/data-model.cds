namespace n.schedule;

entity jobcreate{
	key JOBTYPE		:  String(50);
	key MODULE		:  String(50);
    CRONTIME		:  String(50);
    STARTTIME		:  Timestamp; 
    STOPTIME		:  Timestamp;
    PARAMS			:  String(50);
    ENABLED			:  Integer;
    CREATED			:  Integer;
    STATUS			:  Integer;
}

entity test{
	key JTYPE		:  String(50);
		STATUS		:  Integer;
}

entity tag_master{
key	MANDT		:	String(3);
key	TAG_ID		:	String(38);
key	TAG_DOM		:	String(1);
	TAG1		:	String(30);
	TAG2		:	String(30);
	TAG3		:	String(30);
	TAG4		:	String(30);
	TAG5		:	String(30);
	TAG6		:	String(30);
	TAG7		:	String(30);
	TAG8		:	String(30);
	CREDATE		:	String(10);
	CRETIME		:	String(10);
	CHDAT		:	String(10);
	CHTIM		:	String(10);

}

entity repository{
key	MANDT		:	String(3);
key	TAG_ID		:	String(38);
key	SYSID		:	String(30);	
key	MODULE		:	String(30);
key	SUBMOD		:	String(30);
key	OBJTYP		:	String(30);
key	OBJ_NAME	:	String(30);
	REUSPR		:	String(30);
	CNTCT		:	String(30);
	DESCR		:	String(30);
	URL			:	String(30);
	CREDATE		:	String(10);
	CRETIME		:	String(10);
	CHDAT		:	String(10);
	CHTIM		:	String(10);

}
