<template>
    <transition name="el-fade-in-linear">
        <div>
            <Row :gutter="16">
                <Col :span="6" >
                    <div class="showDa">
                        <Row :gutter="16">
                            <Col :span="8">
                                <div class="crig bg-primary panel-center item-center"><Icon type="ios-box" size="30" color="#fff"></Icon></div>
                            </Col>
                            <Col :span="16">
                                <div>
                                    <div class="font-grey" style="font-size:30px">{{orderNum}}</div>
                                    <div class="" >订单数</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col :span="6" >
                    <div class="showDa">
                        <Row :gutter="16">
                            <Col :span="8">
                                <div class="crig bg-success panel-center item-center"><Icon type="person" size="30" color="#fff"></Icon></div>
                            </Col>
                            <Col :span="16">
                                <div>
                                    <div class="font-grey" style="font-size:30px">{{wxuserNum}}</div>
                                    <div class="" >用户数量</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col :span="6" >
                    <div class="showDa">
                        <Row :gutter="16">
                            <Col :span="8">
                                <div class="crig bg-danger panel-center item-center"><Icon type="university" size="30" color="#fff"></Icon></div>
                            </Col>
                            <Col :span="16">
                                <div>
                                    <div class="font-grey" style="font-size:30px">{{studentNum}}</div>
                                    <div class="" >学生数量</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col :span="6" >
                    <div class="showDa">
                        <Row :gutter="16">
                            <Col :span="8">
                                <div class="crig bg-warning panel-center item-center"><Icon type="social-yen" size="30" color="#fff"></Icon></div>
                            </Col>
                            <Col :span="16">
                                <div>
                                    <div class="font-grey" style="font-size:30px">7852220</div>
                                    <div class="" >缴费总额</div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    </transition>
</template>
<script>
import G2 from "@antv/g2";
import { View } from "@antv/data-set";
var that;
export default {
  data() {
    return {
        studentNum:0,
        wxuserNum:0,
        orderNum:0
    };
  },
  mounted() {
    that = this;
    this.getSData('wxuser','appid',JSON.parse(sessionStorage.getItem("user")).appid ? JSON.parse(sessionStorage.getItem("user")) .sunwouId:JSON.parse(sessionStorage.getItem("user")).appId ,'wxuserNum');
    this.getSData('user',JSON.parse(sessionStorage.getItem("user")).appid ? "appid"
                  : "schoolId",JSON.parse(sessionStorage.getItem("user")) .sunwouId,'studentNum');
    this.getSData('order',JSON.parse(sessionStorage.getItem("user")).appid ? "appid":"schoolId",JSON.parse(sessionStorage.getItem("user")) .sunwouId,'orderNum');
  },
  methods: {
    getSData(url,val,value,name) {
      $.ajax({
        url: sessionStorage.getItem('API') + url+"/find",
        data: {
          query: JSON.stringify({
            fields: [],
            wheres: [
              {
                value: val,
                opertionType: "equal",
                opertionValue: value
              },
              { value: "isDelete", opertionType: "equal", opertionValue: false }
            ],
            sorts: [{ value: "createTime", asc: false }],
            pages: {
              currentPage: 1,
              size: 1
            }
          })
        },
        dataType:'json',
        method:'post',
        success(res){
            if(res.code){
                that[name] = res.params.total
            }
        }
      });
    },
    
  }
};
</script>
