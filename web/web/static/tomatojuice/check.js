const Check = {
    data: () => ({
      studentNumber: '',
      studentName: '',
      date: '',
      day: '',
      time: '',
      place: '',
      numberOfPeople: '',
      purpose: ''
    }),
    created: function() {
        const informationTable = this.$route.params.infomationTable
        this.studentNumber = informationTable.studentNumber
        this.studentName = informationTable.studentName
        this.date = informationTable.date
        this.day = informationTable.day
        this.time = informationTable.time
        this.place = informationTable.place
        this.numberOfPeople = informationTable.numberOfPeople
        this.purpose = informationTable.purpose
      },
    template:`
        <div>
            <p align="center">
                <strong><u>教</u></strong>
                <strong><u> </u></strong>
                <strong><u>室</u></strong>
                <strong><u> </u></strong>
                <strong><u>使</u></strong>
                <strong><u> </u></strong>
                <strong><u>用</u></strong>
                <strong><u> </u></strong>
                <strong><u>願</u></strong>
                <strong><u> </u></strong>
                <strong> </strong>
                <u>№</u>
                <u> <strong></strong></u>
            </p>
            <p>
                上智大学長殿
            </p>
            <p align="right">
                年 月 日
            </p>
            <p>
                （注意）１．願出は土日祝日を除く3日前までに行うこと。２．使用目的は詳細に記入すること。
            </p>
            <div align="center">
                <table border="1" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td width="235" rowspan="2" valign="top">
                                <p>
                                    団体名
                                </p>
                            </td>
                            <td width="96" rowspan="2">
                                <p>
                                    申込責任者
                                </p>
                            </td>
                            <td width="228">
                                <p>
                                    学生番号
                                </p>
                                <p>
                                    {{ studentNumber }}
                                </p>
                            </td>
                            <td width="135" rowspan="2" valign="top">
                                <p>
                                    ℡
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td width="228">
                                <p>
                                    氏名
                                </p>
                                <p>
                                    {{ studentName }}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                上記の者、下記のとおり願出いたしますので、ご許可下さいますようお願いいたします。
            </p>
            <table border="1" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td width="115" colspan="2" valign="top">
                            <p align="center">
                                場所
                            </p>
                            <p>
                                {{ place }}
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="center">
                                月 日
                            </p>
                            <p>
                                {{ date }}
                            </p>
                        </td>
                        <td width="60" valign="top">
                            <p align="center">
                                曜日
                            </p>
                            <p>
                                {{ day }}
                            </p>
                        </td>
                        <td width="180" colspan="2" valign="top">
                            <p align="center">
                                使用時間
                            </p>
                            <p>
                                {{ time }}
                            </p>
                        </td>
                        <td width="60" valign="top">
                            <p align="center">
                                人数
                            </p>
                            <p>
                                {{ numOfPeople }}
                            </p>
                        </td>
                        <td width="156" valign="top">
                            <p align="center">
                                使用目的
                            </p>
                            <p>
                                {{ purpose }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="120" colspan="2" valign="top">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="180" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="156">
                        </td>
                    </tr>
                    <tr>
                        <td width="691" colspan="9" valign="top">
                            <p>
                                （事務上所見）台帳記載<em></em>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="691" colspan="9" valign="top">
                        </td>
                    </tr>
                    <tr>
                        <td width="691" colspan="9" valign="top">
                        </td>
                    </tr>
                    <tr>
                        <td width="92" valign="top">
                        </td>
                        <td width="90" colspan="2" valign="top">
                        </td>
                        <td width="246" colspan="3" valign="top">
                            <p align="center">
                                管財グループ
                            </p>
                        </td>
                        <td width="263" colspan="3" valign="top">
                            <p align="center">
                                学生ｾﾝﾀｰ
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="92" valign="top">
                        </td>
                        <td width="90" colspan="2" valign="top">
                        </td>
                        <td width="246" colspan="3" valign="top">
                        </td>
                        <td width="263" colspan="3" valign="top">
                        </td>
                    </tr>
                    <tr height="0">
                        <td width="73">
                        </td>
                        <td width="17">
                        </td>
                        <td width="53">
                        </td>
                        <td width="40">
                        </td>
                        <td width="51">
                        </td>
                        <td width="113">
                        </td>
                        <td width="37">
                        </td>
                        <td width="51">
                        </td>
                        <td width="119">
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                <img
                    width="746"
                    height="2"
                    src="file:///C:/Users/HIRAOK~1/AppData/Local/Temp/msohtmlclip1/01/clip_image001.gif"
                />
            </p>
            <br clear="ALL"/>
            <p align="center">
                <strong><u> </u></strong>
                <strong><u>教</u></strong>
                <strong><u> </u></strong>
                <strong><u>室</u></strong>
                <strong><u> </u></strong>
                <strong><u>使</u></strong>
                <strong><u> </u></strong>
                <strong><u>用</u></strong>
                <strong><u> </u></strong>
                <strong><u>許</u></strong>
                <strong><u> </u></strong>
                <strong><u>可</u></strong>
                <strong><u> </u></strong>
                <strong><u>証</u></strong>
                <strong><u> </u></strong>
                <u>№</u>
                <u> </u>
            </p>
            <p>
                <u></u>
            </p>
            <table border="1" cellspacing="0" cellpadding="0">
                <tbody>
                    <tr>
                        <td width="67" valign="top">
                            <p>                    </p>
                        </td>
                        <td width="180" colspan="2" valign="top">
                        </td>
                        <td width="84" colspan="2" valign="top">
                            <p>
                                学生番号
                            </p>
                        </td>
                        <td width="144" valign="top">
                        </td>
                        <td width="48" valign="top">
                            <p>
                                氏名
                            </p>
                        </td>
                        <td width="168" valign="top">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2" valign="top">
                            <p align="center">
                                場所
                            </p>
                        </td>
                        <td width="132" valign="top">
                            <p align="center">
                                月 日
                            </p>
                        </td>
                        <td width="60" valign="top">
                            <p align="center">
                                曜日
                            </p>
                        </td>
                        <td width="168" colspan="2" valign="top">
                            <p align="center">
                                使用時間
                            </p>
                        </td>
                        <td width="216" colspan="2" valign="top">
                            <p align="center">
                                備考
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                        <td width="216" colspan="2" rowspan="7">
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td width="115" colspan="2">
                            <p>
                                －
                            </p>
                        </td>
                        <td width="132">
                            <p align="right">
                                月 日
                            </p>
                        </td>
                        <td width="60">
                        </td>
                        <td width="168" colspan="2">
                            <p>
                                ： ～ ：
                            </p>
                        </td>
                    </tr>
                    <tr height="0">
                        <td width="56">
                        </td>
                        <td width="35">
                        </td>
                        <td width="103">
                        </td>
                        <td width="51">
                        </td>
                        <td width="20">
                        </td>
                        <td width="120">
                        </td>
                        <td width="43">
                        </td>
                        <td width="125">
                        </td>
                    </tr>
                </tbody>
            </table>
            <p>
                （注意）施設の使用にあたっては必ず本証を携帯するとともに、教室使用規程・使用細則を遵守すること。
            </p>
            <p>
                昼休みは、授業開始に支障がないよう13：25までに片付けて退出すること。
            </p>
        </div>`
}

export { Check }
