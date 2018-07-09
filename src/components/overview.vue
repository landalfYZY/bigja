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
    
  },
  methods: {
   
    
  }
};
</script>
